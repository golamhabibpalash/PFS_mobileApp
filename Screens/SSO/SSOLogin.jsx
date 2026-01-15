import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import appConfig from '../../app.json';
import Toast from 'react-native-toast-message';
import {useAuthDispatch} from '../../Navigation/AuthContext';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {blBgColors} from '../../App/Accessibilities';

const baseUrl = appConfig.apiBaseURL;
const adfsLoginFormUrl = 'appSSO/ADFSAuth';
const adfsLoginUrl = 'user/AppAdfsLogin';

const msalConfig = {
  auth: {
    client_id: 'https://pfs.banglalink.net',
    metadata_address:
      'https://adfs.banglalink.net/FederationMetadata/2007-06/FederationMetadata.xml',
  },
};

const SSOLogin = () => {
  const config = msalConfig;
  const authDispatch = useAuthDispatch();
  const navigation = useNavigation();
  const [loginUrl, setLoginUrl] = useState(`${baseUrl}${adfsLoginFormUrl}`);
  const callBackToApp = async currentUrl => {
    if (currentUrl.url.includes('blpfsapp')) {
      try {
        setLoginUrl(null);
        const tokenIndex = currentUrl.url.indexOf('token=') + 6;

        const token = currentUrl.url.substring(tokenIndex);
        const response = await axios.get(
          `${baseUrl}${adfsLoginUrl}?token=${token}`,
        );

        if (response.data.IsAuthenticated) {
          authDispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data,
          });
          await AsyncStorage.setItem('loggedIn', 'true');
          await AsyncStorage.setItem(
            'loggedInData',
            JSON.stringify(response.data),
          );
          navigation.navigate('Home', {title: 'Home'});
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Error',
            text2:
              'Something went wrong while login with ADFS Login. Please try again.',
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.Message ||
          error.message ||
          'Please check your data connectivity and try again.';
        Toast.show({
          type: 'error',
          text1: 'Login Error!',
          text2: errorMessage,
        });
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor={blBgColors.banglalink}
      />
      {loginUrl ? (
        <WebView
          style={[{height: '100%', width: '100%'}]}
          source={{uri: loginUrl}}
          onNavigationStateChange={callBackToApp}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
      ) : (
        <Text>Please wait. Home page loading ....</Text>
      )}
    </View>
  );
};

export default SSOLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
