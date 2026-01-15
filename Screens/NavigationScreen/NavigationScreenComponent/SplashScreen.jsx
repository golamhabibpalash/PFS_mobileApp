// SplashScreen.jsx
import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = ({nav}) => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
          navigation.navigate('Home');
        } else {
          navigation.navigate('OnboardingScreen');
        }
      } catch (e) {
        console.error('Failed to load login status:', e);
        // navigation.navigate('Login');
        navigation.navigate('OnboardingScreen');

      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
