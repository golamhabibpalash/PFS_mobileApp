const reactNativePreset = require('react-native/jest-preset');

const {'^.+\\.(js|ts|tsx)$': _sourceTransform, ...assetTransforms} =
  reactNativePreset.transform;

module.exports = {
  ...reactNativePreset,
  // The RN preset only transforms js|ts|tsx; this project is mostly .jsx.
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    ...assetTransforms,
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '(jest-)?react-native',
        '@react-native(-community)?',
        '@react-navigation',
        'react-native-.*',
        // These resolve to ESM builds that Jest picks up by default.
        'react-redux',
        'immer',
      ].join('|') +
      ')/)',
  ],
  setupFiles: [...reactNativePreset.setupFiles, '<rootDir>/jest.setup.js'],
};
