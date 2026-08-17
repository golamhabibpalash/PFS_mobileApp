import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../app.json';
import packageJson from '../package.json';

const LAST_CHECK_KEY = 'app_update_last_check';
const SKIP_VERSION_KEY = 'app_update_skip_version';

const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) {
      return -1;
    }
    if (p1 > p2) {
      return 1;
    }
  }
  return 0;
};

const getAppStoreUrl = () => {
  const {appStoreId, bundleId} = appConfig.ios;
  if (appStoreId) {
    return `itms-apps://apps.apple.com/app/id${appStoreId}`;
  }
  return `https://apps.apple.com/app/${bundleId}`;
};

const checkBackendApi = async () => {
  // MOCK for testing — remove when backend endpoint is ready
  return {
    latestVersion: '2.7.0',
    minVersion: '2.7.0',
    isRequired: false,
    updateUrl: getAppStoreUrl(),
    releaseNotes: '• Live auto-refresh for parking & cafeteria data\n• Performance improvements\n• Bug fixes',
  };

  const endpoint = appConfig.update.apiEndpoint;
  if (!endpoint) {
    return null;
  }

  const response = await fetch(`${appConfig.apiBaseURL}${endpoint}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    latestVersion: data.latestVersion || data.minVersion,
    minVersion: data.minVersion || data.latestVersion,
    isRequired: data.isRequired !== false,
    updateUrl: data.updateUrl || getAppStoreUrl(),
    releaseNotes: data.releaseNotes || '',
  };
};

const checkAppStore = async () => {
  const {bundleId} = appConfig.ios;
  if (!bundleId) {
    return null;
  }

  const response = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${bundleId}`,
    {method: 'GET'},
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return null;
  }

  const app = data.results[0];
  const storeVersion = app.version;
  const appStoreId = app.trackId;

  return {
    latestVersion: storeVersion,
    minVersion: storeVersion,
    isRequired: true,
    updateUrl: `itms-apps://apps.apple.com/app/id${appStoreId}`,
    releaseNotes: app.releaseNotes || app.description || '',
  };
};

export const checkForUpdate = async () => {
  try {
    let result = await checkBackendApi();
    console.log('[UpdateCheck] Backend response:', result);
    if (!result) {
      result = await checkAppStore();
      console.log('[UpdateCheck] AppStore response:', result);
    }
    if (!result) {
      console.log('[UpdateCheck] No source returned data');
      return null;
    }

    const currentVersion = packageJson.version;
    const needsUpdate =
      compareVersions(currentVersion, result.latestVersion) < 0;
    const isRequired =
      result.isRequired &&
      compareVersions(currentVersion, result.minVersion) < 0;

    console.log('[UpdateCheck]', {
      currentVersion,
      latestVersion: result.latestVersion,
      needsUpdate,
      isRequired,
    });

    return {
      needsUpdate,
      isRequired,
      latestVersion: result.latestVersion,
      currentVersion,
      updateUrl: result.updateUrl,
      releaseNotes: result.releaseNotes,
    };
  } catch (err) {
    console.log('[UpdateCheck] Error:', err);
    return null;
  }
};

export const openAppStore = () => {
  const url = getAppStoreUrl();
  Linking.openURL(url).catch(() => {
    Linking.openURL(url.replace('itms-apps://', 'https://'));
  });
};

export const shouldCheckForUpdate = async () => {
  const checkOnStartup = appConfig.update.checkOnStartup;
  if (!checkOnStartup) {
    return false;
  }

  const intervalHours = appConfig.update.checkIntervalHours || 24;
  const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);

  if (!lastCheck) {
    return true;
  }

  const elapsed = Date.now() - Number(lastCheck);
  return elapsed >= intervalHours * 60 * 60 * 1000;
};

export const markUpdateChecked = async () => {
  await AsyncStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
};

export const getSkippedVersion = async () => {
  return AsyncStorage.getItem(SKIP_VERSION_KEY);
};

export const skipVersion = async version => {
  await AsyncStorage.setItem(SKIP_VERSION_KEY, version);
};
