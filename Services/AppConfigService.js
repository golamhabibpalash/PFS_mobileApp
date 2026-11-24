import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import appConfig from '../app.json';

// A dedicated instance. SessionManager installs a response interceptor on the
// DEFAULT axios instance that logs the user out on any 401, and instances made
// with axios.create() do not inherit it. This lookup is optional config, not a
// user action: if the settings endpoint is missing or refuses us, we fall back
// to the cached value rather than ending the session. Reading it through the
// default instance is what logged people out when they opened App Settings.
const http = axios.create();

const SESSION_TIMEOUT_CACHE_KEY = 'session_timeout_minutes';
const SETTING_ENDPOINT = 'pfs/api/configurations/GetSettingValue';
export const IDLE_SESSION_TIME_KEY = 'mobileApplication.IdleSessionTime';

const baseUrl = appConfig.apiBaseURL;

/**
 * The setting endpoint may answer with the bare value (`30`, `"30"`) or wrap
 * it in an envelope, so unwrap the usual shapes before parsing.
 */
const unwrapSettingValue = data => {
  if (data === null || data === undefined) {
    return null;
  }
  if (typeof data !== 'object') {
    return data;
  }
  const keys = [
    'value',
    'Value',
    'settingValue',
    'SettingValue',
    'data',
    'Data',
  ];
  const match = keys.find(key => data[key] !== undefined);
  return match ? unwrapSettingValue(data[match]) : null;
};

/**
 * Zero, null, blank and anything non-numeric all mean "no idle timeout", which
 * this module represents as null. Only a positive number is a real timeout.
 */
const normalizeMinutes = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
};

/**
 * True when the backend simply has not implemented the endpoint (or is
 * unreachable), as opposed to rejecting an otherwise valid request. Only the
 * former is safe to fall back to device-local storage for.
 */
const isEndpointUnavailable = error => {
  if (!error?.response) {
    return true; // network failure, DNS, timeout
  }
  // 401/403 included: the setting is simply not readable by this account.
  return [401, 403, 404, 405, 501, 502, 503, 504].includes(
    error.response.status,
  );
};

const cacheMinutes = async minutes => {
  if (minutes) {
    await AsyncStorage.setItem(SESSION_TIMEOUT_CACHE_KEY, String(minutes));
  } else {
    await AsyncStorage.removeItem(SESSION_TIMEOUT_CACHE_KEY);
  }
};

export const getCachedSessionTimeoutMinutes = async () => {
  try {
    const value = await AsyncStorage.getItem(SESSION_TIMEOUT_CACHE_KEY);
    if (!value) {
      return null;
    }
    return normalizeMinutes(value);
  } catch (e) {
    console.error('getCachedSessionTimeoutMinutes:', e);
    return null;
  }
};

/**
 * Reads the idle session timeout from the backend, in minutes. Returns null
 * for an unlimited session. The value is cached so the next cold start can
 * apply it before the network call comes back.
 */
export const fetchSessionConfig = async () => {
  try {
    const response = await http.get(`${baseUrl}${SETTING_ENDPOINT}`, {
      params: {key: IDLE_SESSION_TIME_KEY},
    });
    const minutes = normalizeMinutes(unwrapSettingValue(response.data));
    await cacheMinutes(minutes);
    return minutes;
  } catch (e) {
    if (!isEndpointUnavailable(e)) {
      console.error('fetchSessionConfig:', e);
    }
    // Keep whatever the device already knows rather than silently going
    // unlimited because the endpoint is missing.
    return getCachedSessionTimeoutMinutes();
  }
};
