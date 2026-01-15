import axios from 'axios';
import Toast from 'react-native-toast-message';
import appConfig from '../../app.json';

const baseUrl = appConfig.apiBaseURL;

const parkingDataApi = 'pfs/api/ParkingApi/DailyParkingGraph';
export const getParkingData = async () => {
  const response = await fetch(`${baseUrl}${parkingDataApi}`);
  return response.json();
};

const employeeInfoApi = 'pfs/api/ParkingApi/GetEmpInfoWhileParking';
export const getParkingEmployeeInfo = async (
  LocationId,
  EmployeeId,
  QRCode,
) => {
  const response = await axios.post(`${baseUrl}${employeeInfoApi}`, {
    LocationId,
    EmployeeId,
    QRCode,
  });
  return response.data;
};

const processUrl = 'pfs/api/parkingApi/SaveParkingTransaction_Security';
export const processParkingTransaction = async pParams => {
  try {
    const res = await axios.post(`${baseUrl}${processUrl}`, pParams, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = res.data;
    return data;
  } catch (error) {
    console.error('Error from API response:', error.message);
    Toast.show({
      type: 'error',
      text1: 'Fail to data process',
      text2: 'Getting Error from server; please contact with admin.',
    });
    throw error;
  }
};
