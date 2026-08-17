import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNav from './Navigation/DrawerNav';
import {AuthProvider} from './Navigation/AuthContext';
import Toast from 'react-native-toast-message';
import ToastConfig from './Components/ToastConfig';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './App/Store';
import {KeyboardAvoidingView} from 'react-native';
import {SessionProvider} from './Services/SessionProvider';
import ForceUpdateModal from './Components/ForceUpdateModal';
import {
  checkForUpdate,
  shouldCheckForUpdate,
  markUpdateChecked,
  getSkippedVersion,
  skipVersion,
} from './Services/AppUpdateService';

const App = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const initUpdateCheck = async () => {
      try {
        const shouldCheck = await shouldCheckForUpdate();
        if (!shouldCheck) {
          return;
        }

        const result = await checkForUpdate();
        if (!result || !result.needsUpdate) {
          await markUpdateChecked();
          return;
        }

        const skipped = await getSkippedVersion();
        if (skipped === result.latestVersion && !result.isRequired) {
          await markUpdateChecked();
          return;
        }

        setUpdateInfo(result);
        setShowUpdate(true);
        await markUpdateChecked();
      } catch {}
    };

    initUpdateCheck();
  }, []);

  const handleSkipVersion = async () => {
    if (updateInfo) {
      await skipVersion(updateInfo.latestVersion);
    }
    setShowUpdate(false);
  };

  return (
    <SessionProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <Provider store={store}>
          <StatusBar translucent backgroundColor="transparent" />
          <AuthProvider>
            <NavigationContainer>
              <DrawerNav />
            </NavigationContainer>
            <Toast config={ToastConfig} />
          </AuthProvider>
          <ForceUpdateModal
            visible={showUpdate}
            isRequired={updateInfo?.isRequired ?? false}
            latestVersion={updateInfo?.latestVersion ?? ''}
            currentVersion={updateInfo?.currentVersion ?? ''}
            releaseNotes={updateInfo?.releaseNotes ?? ''}
            onSkip={handleSkipVersion}
          />
        </Provider>
      </KeyboardAvoidingView>
    </SessionProvider>
  );
};

export default App;
