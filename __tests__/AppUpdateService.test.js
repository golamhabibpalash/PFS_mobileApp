const ANDROID_PACKAGE = 'com.blpfs';
const IOS_APP_STORE_ID = '6738879848';

const MARKET_URL = `market://details?id=${ANDROID_PACKAGE}`;
const PLAY_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
const ITMS_URL = `itms-apps://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
const APPLE_WEB_URL = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;

const mockPlatform = os =>
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS: os,
    select: choices => choices[os] ?? choices.default,
  }));

const loadService = () => {
  const {Linking} = require('react-native');
  const openURL = jest.spyOn(Linking, 'openURL');
  const canOpenURL = jest.spyOn(Linking, 'canOpenURL');
  // Default: the platform can handle whatever it is handed. Individual tests
  // narrow this to model a missing store app.
  canOpenURL.mockResolvedValue(true);
  return {openURL, canOpenURL, service: require('../Services/AppUpdateService')};
};

beforeEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe('openAppStore on Android', () => {
  it('opens the Play Store app, not the App Store', async () => {
    mockPlatform('android');
    const {openURL, service} = loadService();
    openURL.mockResolvedValue(true);

    await service.openAppStore();

    expect(openURL).toHaveBeenCalledWith(MARKET_URL);
    expect(openURL).not.toHaveBeenCalledWith(expect.stringContaining('apple'));
  });

  it('falls back to the Play Store web page when the store app is missing', async () => {
    mockPlatform('android');
    const {openURL, canOpenURL, service} = loadService();
    canOpenURL.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    openURL.mockResolvedValue(true);

    await expect(service.openAppStore()).resolves.toBe(true);

    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(PLAY_WEB_URL);
  });

  it('reports failure when nothing can be opened', async () => {
    mockPlatform('android');
    const {openURL, canOpenURL, service} = loadService();
    canOpenURL.mockResolvedValue(false);
    openURL.mockRejectedValue(new Error('nope'));

    await expect(service.openAppStore()).resolves.toBe(false);
    expect(openURL).not.toHaveBeenCalled();
  });
});

describe('openAppStore on iOS', () => {
  it('opens the App Store', async () => {
    mockPlatform('ios');
    const {openURL, service} = loadService();
    openURL.mockResolvedValue(true);

    await service.openAppStore();

    expect(openURL).toHaveBeenCalledWith(ITMS_URL);
  });

  it('falls back to the App Store web page', async () => {
    mockPlatform('ios');
    const {openURL, canOpenURL, service} = loadService();
    canOpenURL.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    openURL.mockResolvedValue(true);

    await service.openAppStore();

    expect(openURL).toHaveBeenCalledWith(APPLE_WEB_URL);
  });

  it('never hands the Simulator an itms-apps URL it cannot open', async () => {
    // openURL resolves for an unhandled scheme, so without the canOpenURL
    // guard this opened Safari on "the address is invalid" and returned true.
    mockPlatform('ios');
    const {openURL, canOpenURL, service} = loadService();
    canOpenURL.mockImplementation(url =>
      Promise.resolve(url.startsWith('https://')),
    );
    openURL.mockResolvedValue(true);

    await expect(service.openAppStore()).resolves.toBe(true);

    expect(openURL).not.toHaveBeenCalledWith(ITMS_URL);
    expect(openURL).toHaveBeenCalledWith(APPLE_WEB_URL);
  });
});

describe('backend-supplied updateUrl', () => {
  it('takes priority over the platform default', async () => {
    mockPlatform('android');
    const {openURL, service} = loadService();
    openURL.mockResolvedValue(true);

    await service.openAppStore('https://internal.example/apk');

    expect(openURL).toHaveBeenNthCalledWith(1, 'https://internal.example/apk');
  });

  it('still falls back to the platform store if it fails', async () => {
    mockPlatform('android');
    const {openURL, canOpenURL, service} = loadService();
    canOpenURL.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    openURL.mockResolvedValue(true);

    await service.openAppStore('https://internal.example/apk');

    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(MARKET_URL);
  });
});
