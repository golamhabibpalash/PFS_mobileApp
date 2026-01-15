import axios from 'axios';
import Toast from 'react-native-toast-message';
import appConfig from '../../app.json';

const baseUrl = appConfig.apiBaseURL;

//Cafeteria Dashboard Slice code
const FetchDashboardDataAsynchApi = 'pfs/api/cafeteria/CafeteriaUserDashboard';
export const FetchCafeteriaDashboardDataAsynch = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}${FetchDashboardDataAsynchApi}`,
    );
    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Getting error! Please Contact with admin',
    });
  }
};

//Cafeteria Registration Slice code
const FetchIndexDataAsynchApi = 'pfs/api/cafeteria/FoodRegistration';
export const getRegistrtaionInfosAsynch = async () => {
  try {
    const response = await axios.get(`${baseUrl}${FetchIndexDataAsynchApi}`);
    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Getting error! Please Contact with admin',
    });
  }
};

const cafeRegistrationAsynchApi = 'pfs/api/cafeteria/FoodRegistration';
export const submitRegistrationAsynch = async foodRegistrationData => {
  try {
    const response = await fetch(
      `${appConfig.apiBaseURL}${cafeRegistrationAsynchApi}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodRegistrationData),
      },
    );
    const data = await response.json();

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

const cafeUserDashboardCalendarApi =
  'pfs/api/cafeteria/GetCafeteriaAppCalenderData';
export const fetchCalendarData = async monthYear => {
  try {
    const response = await axios.get(
      `${baseUrl}${cafeUserDashboardCalendarApi}?monthYear=${monthYear}`,
    );
    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Getting error! Please Contact with admin',
    });
  }
};
