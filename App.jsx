// App.jsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNav from './Navigation/DrawerNav'; // Adjust the path based on your actual file structure
import {AuthProvider} from './Navigation/AuthContext';
import Toast from 'react-native-toast-message';
import ToastConfig from './Components/ToastConfig';
import { Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './App/Store';
import { KeyboardAvoidingView } from 'react-native';

// LogBox.ignoreLogs(['Reanimated 2']);
// LogBox.ignoreLogs(['ViewPropTypes']);
const App = () => {
  return (
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
  );
};

export default App;
