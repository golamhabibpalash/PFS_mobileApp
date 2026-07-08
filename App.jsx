// App.jsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNav from './Navigation/DrawerNav';
import {AuthProvider} from './Navigation/AuthContext';
import Toast from 'react-native-toast-message';
import ToastConfig from './Components/ToastConfig';
import { Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './App/Store';
import { KeyboardAvoidingView } from 'react-native';
import { SessionProvider } from './Services/SessionProvider';

const App = () => {
  return (
    <SessionProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
      <Provider store={store}>
        <StatusBar translucent backgroundColor="transparent" />
        <AuthProvider>
          <NavigationContainer>
            <DrawerNav />
          </NavigationContainer>
          <Toast config={ToastConfig} />
        </AuthProvider>
      </Provider>
      </KeyboardAvoidingView>
    </SessionProvider>
  );
};

export default App;
