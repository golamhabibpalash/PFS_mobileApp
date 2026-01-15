import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {GenericStyles} from './styles/GenericStyles';
import {
  NavigationHeader,
  CustomScreenContainer,
  CustomText,
  CustomTextInput,
  CustomButton,
  FullButtonComponent,
} from './lib';
import ErrorBoundary from './common/ErrorBoundary';
import colors from './common/colors';
import {isAndroid, logErrorWithMessage} from './utilities/helperFunctions';
import TimerText from './TimerText';
import {useAuthDispatch} from '../../Navigation/AuthContext';
import axios from 'axios';
import appConfig from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = appConfig.apiBaseURL;

const RESEND_OTP_TIME_LIMIT = 30; // 30 secs
const AUTO_SUBMIT_OTP_TIME_LIMIT = 4; // 4 secs

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

const OtpVerification = function (props) {
  const {otpRequestData, attempts} = props;
  const {otpModelParams} = props.route.params;
  const {reqParams} = props.route.params;

  const navigation = useNavigation();
  const authDispatch = useAuthDispatch();

  const [attemptsRemaining, setAttemptsRemaining] = useState(attempts);
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [otpModel, setOtpModel] = useState(otpModelParams);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  // 0 < autoSubmitOtpTime < 4 to show auto submitting OTP text
  const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
    AUTO_SUBMIT_OTP_TIME_LIMIT,
  );

  // TextInput refs to focus programmatically while entering OTP
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);

  // a reference to autoSubmitOtpTimerIntervalCallback to always get updated value of autoSubmitOtpTime
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();

  const sendOTPtoMobile = async () => {
    try {
      sendSMSUrl = 'user/SendSMS';
      const otpReq = {
        mobileNumber: otpModel.Attribute1,
        msg: otpModel.Attribute2
      };

      await axios.get(`${baseUrl}${sendSMSUrl}`, {
        params: otpReq,
      });
    } catch (error) {
      console.error('Send SMS API call failed:', error);
    }
  };

  useEffect(() => {
    // autoSubmitOtpTime value will be set after otp is detected,
    // in that case we have to start auto submit timer
    autoSubmitOtpTimerIntervalCallbackReference.current =
      autoSubmitOtpTimerIntervalCallback;
  });

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  useEffect(() => {

    sendOTPtoMobile();

    RNOtpVerify.getOtp()
      .then(p =>
        RNOtpVerify.addListener(message => {
          try {
            if (message) {
              const otp = message.match(/\d{4}/)[0];
                if (otp.length === 4) {
                  setOtpArray(otp.split(''));
                  // to auto submit otp in 4 secs
                  setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
                  startAutoSubmitOtpTimer();
                }
            }
          } catch (error) {
            logErrorWithMessage(
              error.message,
              'RNOtpVerify.getOtp - read message, OtpVerification',
            );
          }
        }),
      )
      .catch(error => {
        logErrorWithMessage(
          error.message,
          'RNOtpVerify.getOtp, OtpVerification',
        );
      });

    // remove listener on unmount
    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const autoSubmitOtpTimerIntervalCallback = () => {
    if (autoSubmitOtpTime <= 0) {
      clearInterval(autoSubmitOtpTimerInterval);

      // submit OTP
      onSubmitButtonPress();
    }
    setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
  };

  const startAutoSubmitOtpTimer = () => {
    if (autoSubmitOtpTimerInterval) {
      clearInterval(autoSubmitOtpTimerInterval);
    }
    autoSubmitOtpTimerInterval = setInterval(() => {
      autoSubmitOtpTimerIntervalCallbackReference.current();
    }, 1000);
  };

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const onResendOtpButtonPress = async () => {
    // clear last OTP
    if (firstTextInputRef) {
      setOtpArray(['', '', '', '']);
      firstTextInputRef.current.focus();
    }

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    try {
      const otpUrl = 'user/SendOtpFromApp';
      setSubmittingOtp(true);
      const res = await axios.get(`${baseUrl}${otpUrl}`, {
        params: reqParams,
      });

      if (res.data.IsSuccess) {
        setOtpModel(res.data.Data);
      } else {
        throw new Error(res.data.Message || 'OTP re-send error.');
      }
    } catch (error) {
      console.log(error.message);
      const errorMessage =
        error.res?.data?.Message ||
        error.message ||
        'Please check your data connectivity and try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Error!',
        text2: errorMessage,
      });
    } finally {
      setSubmittingOtp(false);
    }
  };

  const onSubmitButtonPress = async () => {
    const submittedOtp = otpArray.join('');
    try {
      if (submittedOtp.length < 4) {
        throw new Error('Please fill up otp boxes.');
      }
      if (submittedOtp === otpModel.OTPCode) {
        const otpLoginUrl = 'user/LoginToMobileApp';
        setSubmittingOtp(true);
        const res = await axios.get(`${baseUrl}${otpLoginUrl}`, {
          params: {
            userId: otpModel.CreatedBy,
          },
        });

        if (res.data.IsAuthenticated) {
          authDispatch({
            type: 'LOGIN_SUCCESS',
            payload: res.data,
          });
          await AsyncStorage.setItem('loggedIn', 'true');
          await AsyncStorage.setItem(
            'loggedInData',
            JSON.stringify(res.data),
          );
          navigation.navigate('Home');
        } else {
          throw new Error(res.data.Message || 'Login failed');
        }
      } else {
        throw new Error('OTP is invalid.');
      }
    } catch (error) {
      console.log(error.message);
      const errorMessage =
        error.res?.data?.Message ||
        error.message ||
        'Please check your data connectivity and try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Error!',
        text2: errorMessage,
      });
    } finally {
      setSubmittingOtp(false);
    }
  };

  const onOtpChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        }
      }
    };
  };

  const onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        }

        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = '';
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };

  return (
    <CustomScreenContainer>
      <NavigationHeader
        title={'OTP Verification'}
        leftIconAction={() => {
          navigation.navigate('Login');
        }}
        leftIconType={'back'}
        containerStyle={GenericStyles.navigationHeaderBorder}
      />
      <ErrorBoundary screenName={'OtpVerification'}>
        <View style={styles.container}>
          <CustomText>
            Enter OTP sent to your{' '}
            {otpRequestData.email_id ? 'email' : 'mobile number'}{' '}
          </CustomText>
          <View style={[GenericStyles.row, GenericStyles.mt12]}>
            {[
              firstTextInputRef,
              secondTextInputRef,
              thirdTextInputRef,
              fourthTextInputRef,
            ].map((textInputRef, index) => (
              <CustomTextInput
                containerStyle={[GenericStyles.fill, GenericStyles.mr12]}
                value={otpArray[index]}
                onKeyPress={onOtpKeyPress(index)}
                onChangeText={onOtpChange(index)}
                keyboardType={'numeric'}
                maxLength={1}
                style={[styles.otpText, GenericStyles.centerAlignedText]}
                autoFocus={index === 0 ? true : undefined}
                refCallback={refCallback(textInputRef)}
                key={index}
              />
            ))}
          </View>
          {errorMessage ? (
            <CustomText
              style={[
                GenericStyles.negativeText,
                GenericStyles.mt12,
                GenericStyles.centerAlignedText,
              ]}>
              {errorMessage}
            </CustomText>
          ) : null}
          {resendButtonDisabledTime > 0 ? (
            <TimerText text={'Resend OTP in'} time={resendButtonDisabledTime} />
          ) : (
            <CustomButton
              type={'link'}
              text={'Resend OTP'}
              buttonStyle={styles.otpResendButton}
              textStyle={styles.otpResendButtonText}
              onPress={onResendOtpButtonPress}
            />
          )}
          <View style={GenericStyles.fill} />
          {submittingOtp && <ActivityIndicator />}
          {autoSubmitOtpTime > 0 &&
          autoSubmitOtpTime < AUTO_SUBMIT_OTP_TIME_LIMIT ? (
            <TimerText text={'Submitting OTP in'} time={autoSubmitOtpTime} />
          ) : null}
          <CustomText
            style={[GenericStyles.centerAlignedText, GenericStyles.mt12]}>
            OTP will be expired after 5 minutes
          </CustomText>
          <FullButtonComponent
            type={'fill'}
            text={'Submit'}
            textStyle={styles.submitButtonText}
            buttonStyle={GenericStyles.mt24}
            onPress={onSubmitButtonPress}
            disabled={submittingOtp}
          />
        </View>
      </ErrorBoundary>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  submitButtonText: {
    color: colors.WHITE,
  },
  otpResendButton: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  otpResendButtonText: {
    color: colors.ORANGE,
    textTransform: 'none',
    textDecorationLine: 'underline',
  },
  otpText: {
    fontWeight: 'bold',
    color: colors.BLUE,
    fontSize: 18,
    width: '100%',
  },
});

OtpVerification.defaultProps = {
  attempts: 5,
  otpRequestData: {
    username: 'varunon9',
    email_id: false,
    phone_no: true,
  },
};

OtpVerification.propTypes = {
  otpRequestData: PropTypes.object.isRequired,
  attempts: PropTypes.number.isRequired,
};

export default OtpVerification;
