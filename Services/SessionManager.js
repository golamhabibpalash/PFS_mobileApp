import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getCachedSessionTimeoutMinutes} from './AppConfigService';

export const LAST_ACTIVITY_KEY = 'lastActivityTime';

// Pre-2.6 installs stored the login time under this key for a fixed 24h
// absolute session. Migrated to LAST_ACTIVITY_KEY on first launch.
export const LEGACY_SESSION_START_KEY = 'sessionStartTime';

export const SESSION_STORAGE_KEYS = [
  'loggedIn',
  'loggedInData',
  LAST_ACTIVITY_KEY,
  LEGACY_SESSION_START_KEY,
];

const IDLE_CHECK_INTERVAL_MS = 30 * 1000;
const ACTIVITY_PERSIST_THROTTLE_MS = 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const clearSessionStorage = () =>
  AsyncStorage.multiRemove(SESSION_STORAGE_KEYS);

class SessionManager {
  constructor() {
    this._sessionTimeoutMs = null;
    this._lastActivityTime = null;
    this._idleCheckInterval = null;
    this._appStateSubscription = null;
    this._isSessionActive = false;
    this._onSessionExpireCallbacks = [];
    this._onUnauthorizedCallbacks = [];
    this._appStateBeforeBackground = 'active';
    this._wasBackgrounded = false;
    this._lastPersistedActivity = 0;
    this._legacyMigrationPromise = null;
    this._setupAxiosInterceptor();
  }

  _setupAxiosInterceptor() {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          this._onUnauthorizedCallbacks.forEach(cb => cb());
        }
        return Promise.reject(error);
      },
    );
  }

  setSessionTimeoutMs(ms) {
    const value = Number(ms);
    this._sessionTimeoutMs = Number.isFinite(value) && value > 0 ? value : null;
  }

  setSessionTimeoutMinutes(minutes) {
    const value = Number(minutes);
    this.setSessionTimeoutMs(
      Number.isFinite(value) && value > 0 ? value * MINUTE_MS : null,
    );
  }

  getSessionTimeoutMs() {
    return this._sessionTimeoutMs;
  }

  async startSession() {
    this._lastActivityTime = Date.now();
    this._isSessionActive = true;
    this._lastPersistedActivity = 0;
    this._persistActivity();
    this._startIdleTimer();
    this._setupAppStateListener();
  }

  endSession() {
    this._isSessionActive = false;
    this._lastActivityTime = null;
    this._wasBackgrounded = false;
    this._stopIdleTimer();
    this._removeAppStateListener();
  }

  extendSession() {
    if (this._isSessionActive) {
      this._lastActivityTime = Date.now();
      this._persistActivity();
    }
  }

  onSessionExpire(callback) {
    this._onSessionExpireCallbacks.push(callback);
    return () => {
      this._onSessionExpireCallbacks = this._onSessionExpireCallbacks.filter(
        cb => cb !== callback,
      );
    };
  }

  onUnauthorized(callback) {
    this._onUnauthorizedCallbacks.push(callback);
    return () => {
      this._onUnauthorizedCallbacks = this._onUnauthorizedCallbacks.filter(
        cb => cb !== callback,
      );
    };
  }

  /**
   * Applies the cached timeout and reports whether the stored session has
   * already gone stale. Used by every cold-start path so they cannot drift.
   */
  async bootstrapSession() {
    const cachedMinutes = await getCachedSessionTimeoutMinutes();
    this.setSessionTimeoutMinutes(cachedMinutes);
    return this.isIdleExpired();
  }

  async isIdleExpired() {
    await this._migrateLegacyActivityKey();
    if (!this._sessionTimeoutMs) {
      return false;
    }
    try {
      const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
      if (!lastActivity) {
        return false;
      }
      return Date.now() - Number(lastActivity) >= this._sessionTimeoutMs;
    } catch (e) {
      console.error('isIdleExpired:', e);
      return false;
    }
  }

  /**
   * Carries a pre-2.6 `sessionStartTime` over to `lastActivityTime` so an
   * in-flight session is measured against the new idle policy instead of
   * silently becoming unexpirable. Runs at most once per launch.
   */
  _migrateLegacyActivityKey() {
    if (!this._legacyMigrationPromise) {
      this._legacyMigrationPromise = this._runLegacyMigration();
    }
    return this._legacyMigrationPromise;
  }

  async _runLegacyMigration() {
    try {
      const entries = await AsyncStorage.multiGet([
        LAST_ACTIVITY_KEY,
        LEGACY_SESSION_START_KEY,
      ]);
      const stored = Object.fromEntries(entries);
      const legacyStart = stored[LEGACY_SESSION_START_KEY];
      if (!legacyStart) {
        return;
      }
      if (!stored[LAST_ACTIVITY_KEY]) {
        await AsyncStorage.setItem(LAST_ACTIVITY_KEY, legacyStart);
      }
      await AsyncStorage.removeItem(LEGACY_SESSION_START_KEY);
    } catch (e) {
      console.error('migrateLegacyActivityKey:', e);
    }
  }

  _persistActivity() {
    const now = Date.now();
    if (now - this._lastPersistedActivity < ACTIVITY_PERSIST_THROTTLE_MS) {
      return;
    }
    this._lastPersistedActivity = now;
    AsyncStorage.setItem(
      LAST_ACTIVITY_KEY,
      String(this._lastActivityTime),
    ).catch(() => {});
  }

  _expireNow() {
    this._onSessionExpireCallbacks.forEach(cb => cb());
    this.endSession();
  }

  _hasIdledOut() {
    return (
      this._isSessionActive &&
      !!this._sessionTimeoutMs &&
      Date.now() - this._lastActivityTime >= this._sessionTimeoutMs
    );
  }

  _startIdleTimer() {
    this._stopIdleTimer();
    this._idleCheckInterval = setInterval(() => {
      if (this._hasIdledOut()) {
        this._expireNow();
      }
    }, IDLE_CHECK_INTERVAL_MS);
  }

  _stopIdleTimer() {
    if (this._idleCheckInterval) {
      clearInterval(this._idleCheckInterval);
      this._idleCheckInterval = null;
    }
  }

  _setupAppStateListener() {
    this._removeAppStateListener();
    this._appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        const wentToBackground =
          this._appStateBeforeBackground === 'active' &&
          /inactive|background/.test(nextAppState);
        const cameToForeground =
          /inactive|background/.test(this._appStateBeforeBackground) &&
          nextAppState === 'active';

        if (wentToBackground) {
          this._wasBackgrounded = true;
        } else if (cameToForeground && this._wasBackgrounded) {
          this._wasBackgrounded = false;
          // Timers do not fire reliably while suspended, so re-check on resume.
          if (this._hasIdledOut()) {
            this._expireNow();
          }
        }
        this._appStateBeforeBackground = nextAppState;
      },
    );
  }

  _removeAppStateListener() {
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
      this._appStateSubscription = null;
    }
  }
}

const sessionManager = new SessionManager();
export default sessionManager;
