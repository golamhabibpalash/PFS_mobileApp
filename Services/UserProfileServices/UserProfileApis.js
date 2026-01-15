import appConfig from '../../app.json';

const baseUrl = appConfig.apiBaseURL;

const userProfileDataApi = 'user/GetCurrentUser';
export const getUserData = async () => {
  const response = await fetch(`${baseUrl}${userProfileDataApi}`);
  return response.json();
};
