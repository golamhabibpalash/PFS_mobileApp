import appInfo from '../../app.json';
import {useAuthState} from '../../Navigation/AuthContext';

const baseUrl = appInfo.apiBaseURL;

const parkingDataApi = 'pfs/api/ParkingApi/DailyParkingGraph';
export const getParkingData = async () => {
  const response = await fetch(`${baseUrl}${parkingDataApi}`);
  return response.json();
};

const cafeteiaDataApi = 'pfs/api/cafeteria/GetTodayNextDayData';
export const getCafeSliceData = async () => {
  const response = await fetch(`${baseUrl}${cafeteiaDataApi}`);
  return response.json();
};
