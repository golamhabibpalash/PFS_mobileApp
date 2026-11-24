jest.mock('../Services/AppConfigService', () => ({
  getCachedSessionTimeoutMinutes: jest.fn(),
}));

const MINUTE = 60 * 1000;

// SessionManager is a module singleton whose legacy migration runs once per
// launch, so each test gets a fresh module registry. Everything it touches has
// to be re-required from that same registry or the mocks diverge.
let storage;
let getCachedSessionTimeoutMinutes;
let sessionManager;
let LAST_ACTIVITY_KEY;
let LEGACY_SESSION_START_KEY;
let clearSessionStorage;

beforeEach(async () => {
  jest.resetModules();
  jest.useFakeTimers();

  storage = require('@react-native-async-storage/async-storage');
  await storage.clear();

  ({getCachedSessionTimeoutMinutes} = require('../Services/AppConfigService'));
  getCachedSessionTimeoutMinutes.mockReset();

  const mod = require('../Services/SessionManager');
  sessionManager = mod.default;
  LAST_ACTIVITY_KEY = mod.LAST_ACTIVITY_KEY;
  LEGACY_SESSION_START_KEY = mod.LEGACY_SESSION_START_KEY;
  clearSessionStorage = mod.clearSessionStorage;
});

afterEach(() => {
  sessionManager.endSession();
  jest.useRealTimers();
});

describe('timeout configuration', () => {
  it('treats a positive minute value as a millisecond timeout', () => {
    sessionManager.setSessionTimeoutMinutes(15);
    expect(sessionManager.getSessionTimeoutMs()).toBe(15 * MINUTE);
  });

  it.each([null, undefined, 0, -5, 'abc', NaN])(
    'treats %p as unlimited',
    value => {
      sessionManager.setSessionTimeoutMinutes(value);
      expect(sessionManager.getSessionTimeoutMs()).toBeNull();
    },
  );
});

describe('idle expiry', () => {
  it('fires the expire callback once the timeout elapses', async () => {
    const onExpire = jest.fn();
    sessionManager.onSessionExpire(onExpire);
    sessionManager.setSessionTimeoutMinutes(1);
    await sessionManager.startSession();

    jest.advanceTimersByTime(59 * 1000);
    expect(onExpire).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2 * 1000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not expire while the user keeps interacting', async () => {
    const onExpire = jest.fn();
    sessionManager.onSessionExpire(onExpire);
    sessionManager.setSessionTimeoutMinutes(1);
    await sessionManager.startSession();

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(45 * 1000);
      sessionManager.extendSession();
    }

    expect(onExpire).not.toHaveBeenCalled();
  });

  it('never expires when the timeout is unlimited', async () => {
    const onExpire = jest.fn();
    sessionManager.onSessionExpire(onExpire);
    sessionManager.setSessionTimeoutMinutes(null);
    await sessionManager.startSession();

    jest.advanceTimersByTime(48 * 60 * MINUTE);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('stops notifying after unsubscribe', async () => {
    const onExpire = jest.fn();
    const unsubscribe = sessionManager.onSessionExpire(onExpire);
    unsubscribe();
    sessionManager.setSessionTimeoutMinutes(1);
    await sessionManager.startSession();

    jest.advanceTimersByTime(2 * MINUTE);
    expect(onExpire).not.toHaveBeenCalled();
  });
});

describe('isIdleExpired', () => {
  it('is false when no timeout is configured', async () => {
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now() - MINUTE));
    sessionManager.setSessionTimeoutMinutes(null);
    await expect(sessionManager.isIdleExpired()).resolves.toBe(false);
  });

  it('is false when no activity has ever been recorded', async () => {
    sessionManager.setSessionTimeoutMinutes(5);
    await expect(sessionManager.isIdleExpired()).resolves.toBe(false);
  });

  it('is true when stored activity is older than the timeout', async () => {
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now() - 10 * MINUTE));
    sessionManager.setSessionTimeoutMinutes(5);
    await expect(sessionManager.isIdleExpired()).resolves.toBe(true);
  });

  it('is false when stored activity is within the timeout', async () => {
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now() - 2 * MINUTE));
    sessionManager.setSessionTimeoutMinutes(5);
    await expect(sessionManager.isIdleExpired()).resolves.toBe(false);
  });
});

describe('legacy sessionStartTime migration', () => {
  it('adopts the legacy timestamp when no activity is recorded', async () => {
    const legacy = String(Date.now() - 10 * MINUTE);
    await storage.setItem(LEGACY_SESSION_START_KEY, legacy);
    sessionManager.setSessionTimeoutMinutes(5);

    await expect(sessionManager.isIdleExpired()).resolves.toBe(true);
    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.toBe(legacy);
    await expect(storage.getItem(LEGACY_SESSION_START_KEY)).resolves.toBeNull();
  });

  it('keeps the newer activity value and drops the legacy key', async () => {
    const recent = String(Date.now() - MINUTE);
    await storage.setItem(LAST_ACTIVITY_KEY, recent);
    await storage.setItem(
      LEGACY_SESSION_START_KEY,
      String(Date.now() - 10 * MINUTE),
    );
    sessionManager.setSessionTimeoutMinutes(5);

    await expect(sessionManager.isIdleExpired()).resolves.toBe(false);
    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.toBe(recent);
    await expect(storage.getItem(LEGACY_SESSION_START_KEY)).resolves.toBeNull();
  });

  it('migrates even when the timeout is unlimited', async () => {
    await storage.setItem(
      LEGACY_SESSION_START_KEY,
      String(Date.now() - MINUTE),
    );
    sessionManager.setSessionTimeoutMinutes(null);

    await sessionManager.isIdleExpired();
    await expect(storage.getItem(LEGACY_SESSION_START_KEY)).resolves.toBeNull();
  });
});

describe('bootstrapSession', () => {
  it('applies the cached timeout and reports a stale session', async () => {
    getCachedSessionTimeoutMinutes.mockResolvedValue(5);
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now() - 10 * MINUTE));

    await expect(sessionManager.bootstrapSession()).resolves.toBe(true);
    expect(sessionManager.getSessionTimeoutMs()).toBe(5 * MINUTE);
  });

  it('leaves the session unlimited when nothing is cached', async () => {
    getCachedSessionTimeoutMinutes.mockResolvedValue(null);
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now() - 100 * MINUTE));

    await expect(sessionManager.bootstrapSession()).resolves.toBe(false);
    expect(sessionManager.getSessionTimeoutMs()).toBeNull();
  });
});

describe('activity persistence', () => {
  it('records activity at session start', async () => {
    sessionManager.setSessionTimeoutMinutes(30);
    await sessionManager.startSession();
    await Promise.resolve();

    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.not.toBeNull();
  });

  it('throttles writes but still advances the in-memory clock', async () => {
    sessionManager.setSessionTimeoutMinutes(30);
    await sessionManager.startSession();
    await Promise.resolve();
    const atStart = await storage.getItem(LAST_ACTIVITY_KEY);

    jest.advanceTimersByTime(5 * 1000);
    sessionManager.extendSession();
    await Promise.resolve();

    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.toBe(atStart);

    jest.advanceTimersByTime(90 * 1000);
    sessionManager.extendSession();
    await Promise.resolve();

    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.not.toBe(atStart);
  });

  it('ignores activity once the session has ended', async () => {
    sessionManager.setSessionTimeoutMinutes(30);
    await sessionManager.startSession();
    sessionManager.endSession();

    sessionManager.extendSession();
    expect(sessionManager._lastActivityTime).toBeNull();
  });
});

describe('clearSessionStorage', () => {
  it('removes both the current and legacy session keys', async () => {
    await storage.setItem('loggedIn', 'true');
    await storage.setItem('loggedInData', '{}');
    await storage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    await storage.setItem(LEGACY_SESSION_START_KEY, String(Date.now()));

    await clearSessionStorage();

    await expect(storage.getItem('loggedIn')).resolves.toBeNull();
    await expect(storage.getItem('loggedInData')).resolves.toBeNull();
    await expect(storage.getItem(LAST_ACTIVITY_KEY)).resolves.toBeNull();
    await expect(storage.getItem(LEGACY_SESSION_START_KEY)).resolves.toBeNull();
  });
});

describe('unauthorized handling', () => {
  it('notifies subscribers when a request returns 401', async () => {
    const axios = require('axios');
    const onUnauthorized = jest.fn();
    sessionManager.onUnauthorized(onUnauthorized);

    const handlers = axios.interceptors.response.handlers.filter(Boolean);
    const rejected = handlers[handlers.length - 1].rejected;

    await expect(rejected({response: {status: 401}})).rejects.toBeDefined();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);

    await expect(rejected({response: {status: 500}})).rejects.toBeDefined();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
