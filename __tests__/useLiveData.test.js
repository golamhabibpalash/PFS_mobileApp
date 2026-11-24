import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';

jest.mock('../Services/ParkingServices/ParkingApis', () => ({
  getParkingData: jest.fn(() => Promise.resolve([])),
  getParkingEmployeeInfo: jest.fn(),
  processParkingTransaction: jest.fn(),
}));
jest.mock('../Services/CommonServices/CommonApis', () => ({
  getCafeSliceData: jest.fn(() => Promise.resolve({})),
  getParkingData: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../Services/WebSocketService', () => ({
  __esModule: true,
  default: {connect: jest.fn(), disconnect: jest.fn()},
}));

const {useLiveData} = require('../hooks/useLiveData');
const webSocketManager = require('../Services/WebSocketService').default;
const {
  parkingDataReducer,
} = require('../Services/ParkingServices/SecurityParkingAccessSlice');
const {
  HomePageSliderReducer,
  CafeteriaSliderReducer,
} = require('../Services/CommonServices/HomeScreenSliderSlice');

const makeStore = () =>
  configureStore({
    reducer: {
      securityParkingAccess: parkingDataReducer,
      HomePageSliderData: HomePageSliderReducer,
      CafeteriaSliderData: CafeteriaSliderReducer,
    },
  });

const Consumer = () => {
  useLiveData();
  return null;
};

const mount = store => {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}>
        <Consumer />
      </Provider>,
    );
  });
  return renderer;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('websocket subscriber refcounting', () => {
  it('connects once no matter how many screens are listening', () => {
    const store = makeStore();
    const first = mount(store);
    const second = mount(store);

    expect(webSocketManager.connect).toHaveBeenCalledTimes(1);

    act(() => {
      first.unmount();
      second.unmount();
    });
  });

  it('keeps the connection alive while one screen is still mounted', () => {
    const store = makeStore();
    const first = mount(store);
    const second = mount(store);

    act(() => second.unmount());

    // The home dashboard is still on the stack; tearing its feed down here
    // would leave it frozen until it remounts.
    expect(webSocketManager.disconnect).not.toHaveBeenCalled();

    act(() => first.unmount());
    expect(webSocketManager.disconnect).toHaveBeenCalledTimes(1);
  });

  it('reconnects after every screen has gone away and one returns', () => {
    const store = makeStore();
    const first = mount(store);
    act(() => first.unmount());
    expect(webSocketManager.disconnect).toHaveBeenCalledTimes(1);

    const second = mount(store);
    expect(webSocketManager.connect).toHaveBeenCalledTimes(2);

    act(() => second.unmount());
  });
});
