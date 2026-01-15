import {configureStore} from '@reduxjs/toolkit';
import {combineReducers, applyMiddleware} from 'redux';
import {
  parkingDataReducer,
  employeeInfoReducer,
  parkingTransactionReducer,
} from '../Services/ParkingServices/SecurityParkingAccessSlice';
import {
  requestDataReducer,
  createLoadDataReducer,
} from '../Services/BusinessCard/BusinessCardSlice';
import QRCodeScannerReducer from '../Services/UtilityServices/QRCodeScannerSlice';
import {
  modulebMenuReducer,
  moduleSubMenuReducer,
} from '../Services/CommonServices/ModuleHomeMenuProcessSlice';
import {
  UserDashboardDataReducer,
  UserDashboardCalendarDataReducer,
} from '../Services/CafeteriaServices/CafeteriaDashboardSlice';
import UserProfileReducer from '../Services/UserProfileServices/UserProfileSlice';
import {
  cafeteriaRegistrationDataReducer,
  cafeteriaRegistrationReducer,
} from '../Services/CafeteriaServices/CafeteriaRegistrationSlice';
import {
  HomePageSliderReducer,
  CafeteriaSliderReducer,
} from '../Services/CommonServices/HomeScreenSliderSlice';

const rootReducer = combineReducers({
  BusinessCardLoad: requestDataReducer,
  BusinessCardCreateLoad: createLoadDataReducer,
  securityParkingAccess: parkingDataReducer,
  securityParkingAccessEmployeeInfo: employeeInfoReducer,
  qrCodeScane: QRCodeScannerReducer,
  parkingTransactionProcess: parkingTransactionReducer,
  menuLoad: modulebMenuReducer,
  subMenuLoad: moduleSubMenuReducer,
  CafeteriaDashboard: UserDashboardDataReducer,
  CafeteraiDashboardCalender: UserDashboardCalendarDataReducer,
  UserProfileLoad: UserProfileReducer,
  CafeteriaRegistrationLoad: cafeteriaRegistrationDataReducer,
  FoodRegistration: cafeteriaRegistrationReducer,
  HomePageSliderData: HomePageSliderReducer,
  CafeteriaSliderData: CafeteriaSliderReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
