import {AppState} from 'react-native';
import axios from 'axios';

export const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000;
const IDLE_CHECK_INTERVAL_MS = 30 * 1000;

export const SESSION_START_TIME_KEY = 'sessionStartTime';

class SessionManager {
  constructor() {
    this._sessionTimeoutMs = SESSION_TIMEOUT_MS;
    this._lastActivityTime = null;
    this._idleCheckInterval = null;
    this._appStateSubscription = null;
    this._isSessionActive = false;
    this._onSessionExpireCallbacks = [];
    this._onUnauthorizedCallbacks = [];
    this._appStateBeforeBackground = 'active';
    this._backgroundedAt = null;
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

  startSession() {
    this._lastActivityTime = Date.now();
    this._isSessionActive = true;
    this._startIdleTimer();
    this._setupAppStateListener();
  }

  endSession() {
    this._isSessionActive = false;
    this._lastActivityTime = null;
    this._backgroundedAt = null;
    this._stopIdleTimer();
    this._removeAppStateListener();
  }

  extendSession() {
    if (this._isSessionActive) {
      this._lastActivityTime = Date.now();
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

  _startIdleTimer() {
    this._stopIdleTimer();
    this._idleCheckInterval = setInterval(() => {
      if (!this._isSessionActive) {
        return;
      }
      const elapsed = Date.now() - this._lastActivityTime;
      if (elapsed >= this._sessionTimeoutMs) {
        this._onSessionExpireCallbacks.forEach(cb => cb());
        this.endSession();
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
        if (
          this._appStateBeforeBackground === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          this._backgroundedAt = Date.now();
        } else if (
          this._appStateBeforeBackground.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          if (this._isSessionActive && this._backgroundedAt) {
            const idleElapsed = Date.now() - this._lastActivityTime;
            if (idleElapsed >= this._sessionTimeoutMs) {
              this._onSessionExpireCallbacks.forEach(cb => cb());
              this.endSession();
            }
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
