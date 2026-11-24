// The service must use an axios instance of its own, so the mock exposes the
// same `get` through both the default export and create().
jest.mock('axios', () => {
  const get = jest.fn();
  return {get, create: jest.fn(() => ({get}))};
});

const CACHE_KEY = 'session_timeout_minutes';
const SETTING_KEY = 'mobileApplication.IdleSessionTime';

let axios;
let storage;
let service;

const httpError = status => ({
  response: status ? {status} : undefined,
  message: `Request failed with status code ${status}`,
});

beforeEach(async () => {
  jest.resetModules();
  storage = require('@react-native-async-storage/async-storage');
  await storage.clear();
  axios = require('axios');
  axios.get.mockReset();
  axios.create.mockClear();
  service = require('../Services/AppConfigService');
});

describe('fetchSessionConfig', () => {
  it('requests the idle session setting by key', async () => {
    axios.get.mockResolvedValue({data: 15});

    await service.fetchSessionConfig();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('pfs/api/configurations/GetSettingValue'),
      {params: {key: SETTING_KEY}},
    );
  });

  it('caches a bare numeric value returned by the server', async () => {
    axios.get.mockResolvedValue({data: 15});

    await expect(service.fetchSessionConfig()).resolves.toBe(15);
    await expect(storage.getItem(CACHE_KEY)).resolves.toBe('15');
  });

  it('parses a numeric string value', async () => {
    axios.get.mockResolvedValue({data: '30'});

    await expect(service.fetchSessionConfig()).resolves.toBe(30);
  });

  it.each([
    ['value', {value: '20'}],
    ['Value', {Value: 20}],
    ['SettingValue', {SettingValue: '20'}],
    ['data envelope', {data: {value: 20}}],
  ])('unwraps a %s envelope', async (_label, data) => {
    axios.get.mockResolvedValue({data});

    await expect(service.fetchSessionConfig()).resolves.toBe(20);
  });

  it.each([
    ['zero', 0],
    ['zero as a string', '0'],
    ['null', null],
    ['an empty string', ''],
    ['a non-numeric string', 'abc'],
    ['a negative number', -5],
  ])('treats %s as unlimited and clears the cache', async (_label, value) => {
    await storage.setItem(CACHE_KEY, '30');
    axios.get.mockResolvedValue({data: value});

    await expect(service.fetchSessionConfig()).resolves.toBeNull();
    await expect(storage.getItem(CACHE_KEY)).resolves.toBeNull();
  });

  it('treats a missing value in the envelope as unlimited', async () => {
    axios.get.mockResolvedValue({data: {key: SETTING_KEY}});

    await expect(service.fetchSessionConfig()).resolves.toBeNull();
  });

  it('keeps the cached value when the endpoint 404s', async () => {
    await storage.setItem(CACHE_KEY, '2');
    axios.get.mockRejectedValue(httpError(404));

    await expect(service.fetchSessionConfig()).resolves.toBe(2);
    await expect(storage.getItem(CACHE_KEY)).resolves.toBe('2');
  });

  it('keeps the cached value when the network is unreachable', async () => {
    await storage.setItem(CACHE_KEY, '5');
    axios.get.mockRejectedValue(httpError(undefined));

    await expect(service.fetchSessionConfig()).resolves.toBe(5);
  });

  it('does not log an error for a missing endpoint', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(httpError(404));

    await service.fetchSessionConfig();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('still logs an error for a genuine server failure', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(httpError(500));

    await service.fetchSessionConfig();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('getCachedSessionTimeoutMinutes', () => {
  it('returns the cached value', async () => {
    await storage.setItem(CACHE_KEY, '45');

    await expect(service.getCachedSessionTimeoutMinutes()).resolves.toBe(45);
  });

  it('returns null when nothing is cached', async () => {
    await expect(service.getCachedSessionTimeoutMinutes()).resolves.toBeNull();
  });
});

describe('session safety', () => {
  it('reads the setting through its own axios instance', async () => {
    // SessionManager's 401 interceptor lives on the default instance. Going
    // through it is what logged users out when they opened App Settings.
    axios.get.mockResolvedValue({data: 15});

    await service.fetchSessionConfig();

    expect(axios.create).toHaveBeenCalled();
  });

  it.each([401, 403])(
    'keeps the cached value when the endpoint answers %i',
    async status => {
      await storage.setItem(CACHE_KEY, '20');
      axios.get.mockRejectedValue(httpError(status));

      await expect(service.fetchSessionConfig()).resolves.toBe(20);
      await expect(storage.getItem(CACHE_KEY)).resolves.toBe('20');
    },
  );

  it('does not log an error when the account may not read the setting', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(httpError(401));

    await service.fetchSessionConfig();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
