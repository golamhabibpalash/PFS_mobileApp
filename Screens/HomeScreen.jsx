// HomeScreen.jsx
import React, {useEffect, useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainDashboard from './Home/MainDashboard';
import DynamicIcon from '../Components/DynamicIcon';
import {blBgColors, blFontSize} from '../App/Accessibilities';
import UserProfile from './UserProfile/UserProfile';
import {useDispatch, useSelector} from 'react-redux';
import {FetchUserProfile} from '../Services/UserProfileServices/UserProfileSlice';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import NavigationScreen from './NavigationScreen/NavigationScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar button component
const CustomTabBarButton = ({
  accessibilityLabel,
  accessibilityState,
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.tabBarItemStyle, {flex: 1}]}>
      {children}
    </TouchableOpacity>
  );
};

const HomeScreen = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(FetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Exit App', 'Do you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Tab1Screen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {fontSize: blFontSize.body},
          headerShown: false,
          headerLeft: false,
          headerRight: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveTintColor: '#fff',
          tabBarIcon: ({color, size}) => (
            <View>
              <DynamicIcon
                iconName="home"
                iconColor={color}
                iconSize={size}
                iconType="FontAwesome"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Tab2Screen}
        options={{
          tabBarLabel: 'Menu',
          tabBarLabelStyle: {fontSize: blFontSize.body},
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveTintColor: '#fff',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon
              iconName="navicon"
              iconColor={color}
              iconSize={size}
              iconType="FontAwesome"
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Tab4Screen}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {fontSize: blFontSize.body},
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveTintColor: '#fff',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon
              iconName="user-circle"
              iconColor={color}
              iconSize={size}
              iconType="FontAwesome"
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const Tab1Screen = () => <MainDashboard />;
const Tab2Screen = () => <NavigationScreen />;
const Tab4Screen = () => <UserProfile />;

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
  },
  tabBarStyle: {
    backgroundColor: '#000',
    padding: 10,
    paddingHorizontal: 30,
    minHeight: Platform.OS == 'ios' ? 85 : 60,
  },
  tabBarItemStyle: {
    maxWidth: '50%',
    // borderWidth: 1,
    // borderColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    elevation: 3,
  },
});

export default HomeScreen;
