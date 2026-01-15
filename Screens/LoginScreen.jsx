// LoginScreen.jsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {useAuthDispatch} from '../Navigation/AuthContext';
import Toast from 'react-native-toast-message';
import appConfig from '../app.json';
import {ActivityIndicator} from 'react-native-paper';
import {blBgColors} from '../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';
import DynamicIcon from '../Components/DynamicIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';

const {height: screenHeight} = Dimensions.get('window');

const baseUrl = appConfig.apiBaseURL;

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [disabledLoign, setDisabledLogin] = useState(false);
  const [disabledOtp, setDisabledOtp] = useState(false);
  const authDispatch = useAuthDispatch();

  const validation = () => {
    let validationMsg = '';
    if (username.length < 1 || password.length < 1) {
      validationMsg = 'Please insert username and password & try again.';
    }
    return validationMsg;
  };

  const handleLogin = async () => {
    try {
      if (validation() == '') {
        const apiUrl = 'user/ApiLogin';
        setLoginLoading(true);
        setDisabledOtp(true);
        const response = await axios.post(`${baseUrl}${apiUrl}`, {
          email: username,
          password: password,
        });
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

          setUsername('');
          setPassword('');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Error',
            text2: 'Invalid credentials. Please try again.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid',
          text2: validation(),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Error!',
        text2: 'Please Check your data connectivity & try again.',
      });
    } finally {
      setLoginLoading(false);
      setDisabledOtp(false);
    }
  };

  const handleADFSLogin = () => {
    navigation.navigate('SSOLogin', {title: 'SSO Login'});
  };
  const handleLoginOTP = async () => {
    console.log("OTP Login Started");
    try {
      if (username.length < 1) {
        throw new Error('Please insert username');
      }

      setLoading(true);

      const hash = await RNOtpVerify.getHash();
      const otpUrl = 'user/SendOtpFromApp';
      const parameters = {
        otpHash: hash[0],
        emailOrNumber: username,
      };
      const res = await axios.get(`${baseUrl}${otpUrl}`, {
        params: parameters,
      });

      console.log("OTP", res?.data)

      if (res.data.IsSuccess) {
        navigation.navigate('OTPLogin', {
          otpModelParams: res.data.Data,
          reqParams: parameters,
        });
      } else {
        throw new Error(res.data.Message || 'Login failed');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={styles.wrapper}
    >
    <SafeAreaView style={styles.container}>
      <StatusBar
        hidden={true}
        barStyle="light-content" // or "dark-content"
        backgroundColor={blBgColors.banglalink}
      />
      <ScrollView>
        <LinearGradient
          style={styles.wrapper}
          // colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
          colors={['#fff', '#fff']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                style={styles.logo}
                source={require('../Asset/PFS_LOGO.png')}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>Login</Text>
              <Text style={styles.subTitleText}>Login to continue</Text>
            </View>
            <View style={styles.textInputContainer}>
              <View style={styles.textInputIconWrapper}>
                <DynamicIcon
                  style={styles.textInputIcon}
                  iconName={'account'}
                  iconColor={'#fff'}
                  iconSize={24}
                  iconType={'MaterialCommunityIcons'}
                />
              </View>
              <TextInput
                style={styles.TextInput}
                placeholder="Email/Mobile"
                value={username}
                placeholderTextColor="#fff"
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.textInputContainer}>
              <View style={styles.textInputIconWrapper}>
                <DynamicIcon
                  style={styles.textInputIcon}
                  iconName={'key-variant'}
                  iconColor={'#fff'}
                  iconSize={24}
                  iconType={'MaterialCommunityIcons'}
                />
              </View>
              <TextInput
                secureTextEntry={true}
                style={styles.TextInput}
                placeholder="Password"
                value={password}
                placeholderTextColor="#fff"
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.submitButtonContainer}>
              <TouchableOpacity onPress={handleLogin} disabled={disabledLoign}>
                <LinearGradient
                  style={styles.loginBtn}
                  colors={[
                    blBgColors.primaryGradient,
                    blBgColors.secondaryGradient,
                  ]}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}>
                  {!loginLoading && (
                    <Text style={styles.loginText}>LOG IN</Text>
                  )}
                  {loginLoading && <ActivityIndicator size={20} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLoginOTP} disabled={disabledOtp}>
                <LinearGradient
                  style={styles.loginBtn}
                  colors={[
                    blBgColors.primaryGradient,
                    blBgColors.secondaryGradient,
                  ]}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}>
                  {!loading && (
                    <Text style={styles.loginText}>Login with OTP</Text>
                  )}
                  {loading && <ActivityIndicator size={20} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleADFSLogin} disabled={disabledOtp}>
                <LinearGradient
                  style={styles.loginBtn}
                  colors={[
                    blBgColors.primaryGradient,
                    blBgColors.secondaryGradient,
                  ]}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.loginText}>Company SSO</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.blLogoArea}>
            <Image
              style={styles.logo}
              source={require('../Asset/logoVerticalNew.png')}
              // source={require('../Asset/PFS_LOGO.png')}

              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper:{
    flex:1,
    backgroundColor:"#fff"
  },
  container: {
    flex: 1,
  },
  logoContainer: {height: screenHeight * 0.2, marginTop: screenHeight * 0.1},
  logoWrapper: {padding: 10},
  logo: {width: '100%', height: '100%'},
  content: {
    height: screenHeight * 0.7,
    zIndex: 2,
    width: '90%',
    alignSelf: 'center',
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 40,
    color: '#000',
    fontWeight: 'bold',
  },
  subTitleText: {},
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: blBgColors.toffee,
    borderRadius: 5,
    margin: 10,
  },
  TextInput: {
    backgroundColor: blBgColors.toffee,
    color: '#fff',
    width: '85%',
    paddingVertical:15
  },
  textInputIconWrapper: {
    paddingHorizontal: 10,
  },
  submitButtonContainer: {
    width: '60%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    margin: 10,
    padding: 10,
    alignSelf: 'center',
    zIndex: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  loginBtn: {
    minWidth: '35%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  footerContentContaner: {
    alignItems: 'center',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerContextText: {
    color: '#fff',
  },
  blLogoArea: {
    padding: 5,
    height: screenHeight * 0.05,
    zIndex: 1,
    marginTop: -40,
  },
});

export default LoginScreen;
