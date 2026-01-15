// StackNav.jsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import CafeteriaHome from '../Screens/Cafeteria/CafeteriaHome';
import CafeteriaRegistration from '../Screens/Cafeteria/CafeteriaRegistration';
import CafeteriaRegistrationIndex from '../Screens/Cafeteria/CafeteriaRegistrationIndex';
import CafeteriaUserDashboard from '../Screens/Cafeteria/CafeteriaUserDashboard';
import CafeteriaAvailLunch from '../Screens/Cafeteria/CafeteriaAvailLunch';
import CafeteriaTransfer from '../Screens/Cafeteria/CafeteriaTransfer';
import CustomDatePickerModal from '../Screens/Cafeteria/CafeComponent/CustomDatePickerModal';
import CafeModalView from '../Screens/Cafeteria/CafeComponent/CafeModalView';
import AddContent from '../Screens/Dispatch/AddContent';
import OutBoundInsertUpdate from '../Screens/Dispatch/OutBoundInsertUpdate';
import DataTable from '../Screens/Dispatch/DispatchComponant/DataTable';
import ParkingDataTable from '../Screens/Parking/Component/ParkingDataTable';
import ParkingRegistration from '../Screens/Parking/ParkingRegistration';
import ParkingDashboard from '../Screens/Parking/ParkingDashboard';
import SecurityParkingAccess from '../Screens/Parking/SecurityParkingAccess';
import ScannerScreen from '../Screens/Parking/Component/ScannerScreen';
import ParkingHome from '../Screens/Parking/ParkingHome';
import DispatchHome from '../Screens/Dispatch/DispatchHome';
import BusinessCardHome from '../Screens/BusinessCard/BusinessCardHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import BusinessCardList from '../Screens/BusinessCard/BusinessCardList';

import BusinessCardInsertUpdate from '../Screens/BusinessCard/BusinessCardInsertUpdate';
import {StyleSheet, View} from 'react-native';
import {blBgColors, blFontColor} from '../App/Accessibilities';
import ModuleDashboard from '../Screens/ModuleGroup/ModuleDashboard';
import {NavigationContainer} from '@react-navigation/native';
import ParkingTable from '../Screens/Parking/Component/ParkingTable';
import SSOLogin from '../Screens/SSO/SSOLogin';
import Search from '../Screens/Home/HomeComponent/Search';
import SplashScreen from '../Screens/NavigationScreen/NavigationScreenComponent/SplashScreen';
import CustomStackHeaderComponent from '../Components/CustomStackHeaderComponent';
import AboutAppScreen from '../Screens/UserProfile/AboutAppScreen';
import TermsAndConditionsScreen from '../Screens/UserProfile/TermsAndConditionsScreen';
import {useAuthDispatch} from '../Navigation/AuthContext';
import OtpVerification from '../Screens/OtpLogin/OtpVerification';
import UserProfile from '../Screens/UserProfile/UserProfile';
import WelcomeScreen from '../Screens/welcome/Welcome';
import FAQScreen from '../Screens/welcome/FAQ';
import OnboardingScreen from '../Screens/welcome/Onboard';

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const authDispatch = useAuthDispatch();
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (loggedIn) {
          const loggedInData = await AsyncStorage.getItem('loggedInData');
          authDispatch({
            type: 'LOGIN_SUCCESS',
            payload: JSON.parse(loggedInData),
          });
          setInitialRoute('Home');
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={({route}) => ({
          header: () => (
            <CustomStackHeaderComponent title={route.params?.title} />
          ),
          // title: route.params?.title || 'Default Title',
          // headerTintColor: blFontColor.BLNavigationMenuTitle,
          // headerStyle: style.screenHeader,
        })}
        initialRouteName={'SplashScreen'}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{headerShown:false}} />
        <Stack.Screen name="FAQScreen" component={FAQScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown:false}} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Login',
            headerShown: false,
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen
          name="SSOLogin"
          component={SSOLogin}
          options={{
            title: 'SSO Login',
            headerStyle: {
              height: 20,
            },
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OTPLogin"
          component={OtpVerification}
          options={{
            title: 'Login with OTP',
            headerStyle: {
              height: 20,
            },
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Seacrh" component={Search} />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            headerStyle: {
              height: 20,
            },
            headerShown: true,
          }}
        />

        {/* Cafeteria stack */}
        <Stack.Screen name="CafeteriaHome" component={CafeteriaHome} />
        <Stack.Screen
          name="CafeRegistration"
          component={CafeteriaRegistration}
        />
        <Stack.Screen
          name="CafeRegistrationIndex"
          component={CafeteriaRegistrationIndex}
        />
        <Stack.Screen name="CafeDashboard" component={CafeteriaUserDashboard} />
        <Stack.Screen name="CafeAvailLunch" component={CafeteriaAvailLunch} />
        <Stack.Screen name="CafeTransfer" component={CafeteriaTransfer} />
        <Stack.Screen
          name="CustomDatePickerModal"
          component={CustomDatePickerModal}
        />
        <Stack.Screen name="CafeModalView" component={CafeModalView} />

        {/* Dispatch */}
        <Stack.Screen name="DispatchHome" component={DispatchHome} />
        <Stack.Screen name="AddContent" component={AddContent} />
        <Stack.Screen
          name="OutBoundInsertUpdate"
          component={OutBoundInsertUpdate}
        />
        <Stack.Screen name="DataTable" component={DataTable} />

        <Stack.Screen
          name="ParkingHome"
          component={ParkingHome}
          options={{
            title: 'Parking',
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen
          name="ParkingDataTable"
          component={ParkingDataTable}
          options={{
            title: 'Parking List',
            headerStyle: style.screenHeader,
          }}
        />
        <Stack.Screen
          name="ParkingRegistration"
          component={ParkingRegistration}
          options={{
            title: 'Parking Registration',
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen
          name="ParkingDashboard"
          component={ParkingDashboard}
          options={{
            title: 'Parking Dashboard',
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen
          name="SecurityParkingAccess"
          component={SecurityParkingAccess}
        />
        <Stack.Screen name="ParkingInfoTable" component={ParkingTable} />
        <Stack.Screen
          name="BusinessCardHome"
          component={BusinessCardHome}
          options={{
            title: 'Business Card',
            headerStyle: style.screenHeader,
          }}
        />
        {/* <Stack.Screen
          name="BusinessCardList"
          component={BusinessCardList}
          options={{
            title: 'Business Card List',
            headerStyle: style.screenHeader,
          }}
        /> */}
        <Stack.Screen
          name="BusinessCardInsertUpdate"
          component={BusinessCardInsertUpdate}
          options={{
            title: 'Business Card Save',
            headerStyle: style.screenHeader,
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            title: 'PFS Scanner',
            headerStyle: style.screenHeader,
          }}
        />

        <Stack.Screen name="ModuleDashboard" component={ModuleDashboard} />
        <Stack.Screen name="aboutAppScreen" component={AboutAppScreen} />
        <Stack.Screen
          name="termsConditions"
          component={TermsAndConditionsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const style = StyleSheet.create({
  screenHeader: {
    backgroundColor: blBgColors.primaryGradient,
  },
  screenHeaderText: {
    color: blFontColor.BLNavigationMenuTitle,
  },
});

export default StackNav;
