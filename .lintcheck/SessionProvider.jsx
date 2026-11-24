import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAuthState, useAuthDispatch} from '../Navigation/AuthContext';
import Toast from 'react-native-toast-message';
import sessionManager from './SessionManager';

const ExtendSessionContext = createContext();

export const SessionProvider = ({children}) => {
  const extendSession = useCallback(() => {
    sessionManager.extendSession();
  }, []);

  return (
    <ExtendSessionContext.Provider value={extendSession}>
      <View style={{flex: 1}} onTouchStart={extendSession}>
        {children}
      </View>
    </ExtendSessionContext.Provider>
  );
};

export const SessionWatcher = () => {
  const {IsAuthenticated} = useAuthState();
  const authDispatch = useAuthDispatch();
  const navigation = useNavigation();
  const prevAuthRef = useRef(IsAuthenticated);

  useEffect(() => {
    const handleExpireOrUnauthorized = async () => {
      try {
        await AsyncStorage.multiRemove([
          'loggedIn',
          'loggedInData',
          'sessionStartTime',
        ]);
      } catch (e) {
        console.error('Session clear error:', e);
      }
      authDispatch({type: 'LOGOUT'});
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Your session has expired. Please login again.',
      });
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    };

    const unsubExpire = sessionManager.onSessionExpire(
      handleExpireOrUnauthorized,
    );
    const unsubUnauth = sessionManager.onUnauthorized(
      handleExpireOrUnauthorized,
    );

    return () => {
      unsubExpire();
      unsubUnauth();
    };
  }, [authDispatch, navigation]);

  useEffect(() => {
    if (IsAuthenticated && !prevAuthRef.current) {
      sessionManager.startSession();
    } else if (!IsAuthenticated && prevAuthRef.current) {
      sessionManager.endSession();
    }
    prevAuthRef.current = IsAuthenticated;
  }, [IsAuthenticated]);

  return null;
};

export const useExtendSession = () => useContext(ExtendSessionContext);
