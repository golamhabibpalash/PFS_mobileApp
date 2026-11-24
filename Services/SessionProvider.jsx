import React, {useEffect, useRef, useCallback} from 'react';
import {View, PanResponder, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuthState, useAuthDispatch} from '../Navigation/AuthContext';
import sessionManager, {clearSessionStorage} from './SessionManager';

export const SessionProvider = ({children}) => {
  const extendSession = useCallback(() => {
    sessionManager.extendSession();
  }, []);

  // Capture-phase handlers that never claim the responder, so every touch and
  // drag (including scrolls, which never bubble a touch end) counts as
  // activity without interfering with the gesture itself.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        sessionManager.extendSession();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        sessionManager.extendSession();
        return false;
      },
    }),
  ).current;

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', extendSession),
      Keyboard.addListener('keyboardDidHide', extendSession),
    ];
    return () => subscriptions.forEach(sub => sub.remove());
  }, [extendSession]);

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      {children}
    </View>
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
        await clearSessionStorage();
      } catch (e) {
        console.error('Session clear error:', e);
      }
      authDispatch({type: 'LOGOUT'});
      // Deliberately silent. Being returned to the login screen already tells
      // the user what happened; an error toast on top of it reads like a fault
      // in the app rather than a normal timeout.
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
