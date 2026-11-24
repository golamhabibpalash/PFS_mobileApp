import {AppState} from 'react-native';

let manager;
let appStateHandler;

const flushTimers = () => jest.advanceTimersByTime(0);

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  appStateHandler = null;
  jest
    .spyOn(AppState, 'addEventListener')
    .mockImplementation((event, handler) => {
      appStateHandler = handler;
      return {remove: jest.fn()};
    });

  global.WebSocket = jest.fn(function () {
    this.close = jest.fn();
    global.WebSocket.instances.push(this);
  });
  global.WebSocket.instances = [];

  manager = require('../Services/WebSocketService').default;
});

afterEach(() => {
  manager.destroy();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const connect = (overrides = {}) => {
  const poll = jest.fn();
  manager.connect({
    wsUrl: 'wss://example.test/ws',
    fallbackPollingFn: poll,
    fallbackIntervalMs: 15000,
    ...overrides,
  });
  return poll;
};

describe('backgrounding and resuming', () => {
  it('reopens the socket after the app returns to the foreground', () => {
    connect();
    expect(global.WebSocket.instances).toHaveLength(1);

    appStateHandler('background');
    appStateHandler('active');

    // Without clearing isDestroyed on resume this stays at 1 forever and the
    // connection silently degrades to polling.
    expect(global.WebSocket.instances).toHaveLength(2);
  });

  it('stops polling while backgrounded', () => {
    const poll = connect();
    // Force the fallback path by failing the socket.
    global.WebSocket.instances[0].onclose();
    jest.advanceTimersByTime(60000);
    manager._startFallbackPolling();
    poll.mockClear();

    appStateHandler('background');
    jest.advanceTimersByTime(60000);

    expect(poll).not.toHaveBeenCalled();
  });

  it('resets the reconnect backoff on resume', () => {
    connect();
    global.WebSocket.instances[0].onclose();
    expect(manager.attempts).toBeGreaterThan(0);

    appStateHandler('background');
    appStateHandler('active');

    expect(manager.attempts).toBe(0);
  });
});

describe('fallback polling', () => {
  it('starts polling straight away instead of waiting out the backoff', () => {
    // Ten reconnect attempts take 182s. Nothing on screen refreshed until
    // that budget was spent, which read as "this page never updates".
    const poll = connect();

    jest.advanceTimersByTime(15000);

    expect(poll).toHaveBeenCalledTimes(1);
  });

  it('does not double-fetch on connect', () => {
    // The hook already fetches on mount; polling should not fire a second
    // request in the same tick.
    const poll = connect();

    expect(poll).not.toHaveBeenCalled();
  });

  it('polls on the configured interval once the socket fails', () => {
    const poll = connect();
    manager.attempts = 10; // exhaust reconnect attempts
    global.WebSocket.instances[0].onclose();
    flushTimers();

    poll.mockClear();
    jest.advanceTimersByTime(45000);

    expect(poll).toHaveBeenCalledTimes(3);
  });

  it('stops polling once the socket connects', () => {
    const poll = connect();
    manager._onOpen();
    poll.mockClear();
    jest.advanceTimersByTime(60000);

    expect(poll).not.toHaveBeenCalled();
  });

  it('resumes polling after a background trip', () => {
    const poll = connect();
    appStateHandler('background');
    poll.mockClear();

    appStateHandler('active');
    jest.advanceTimersByTime(15000);

    expect(poll.mock.calls.length).toBeGreaterThan(0);
  });
});
