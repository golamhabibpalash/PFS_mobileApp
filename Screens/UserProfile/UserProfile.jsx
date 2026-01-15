import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  FetchUserProfile,
  setProfileHeaderShow,
} from '../../Services/UserProfileServices/UserProfileSlice';
import ImageComponent from '../../Components/ImageComponent';
import {blBgColors, blFontColor, blFontSize} from '../../App/Accessibilities';
import DynamicIcon from '../../Components/DynamicIcon';
import {useNavigation} from '@react-navigation/native';
import {useAuthDispatch} from '../../Navigation/AuthContext';
import HomeHeaderView from '../Home/HomeComponent/HomeHeaderView';
import axios from 'axios';
import appConfig from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = appConfig.apiBaseURL;
const adfsLogoutUrl = 'appSSO/ADAuthSignOut';

const generalInfo = [
  // {
  //   iconName: 'mobile-screen',
  //   iconType: 'FontAwesome6',
  //   infoTitle: 'About App',
  //   componentName: 'aboutAppScreen',
  // },
  // {
  //   iconName: 'file-lines',
  //   iconType: 'FontAwesome6',
  //   infoTitle: 'Terms & Conditions',
  //   componentName: 'termsConditions',
  // },
  // {
  //   iconName: 'shield-check',
  //   iconType: 'MaterialCommunityIcons',
  //   infoTitle: 'Privacy Policy',
  //   componentName: '',
  // },
  {
    iconName: 'share-alt',
    iconType: 'FontAwesome',
    infoTitle: 'Share This App',
    componentName: '',
  },
];

const shareApp = async () => {
  try {
    const result = await Share.share({
      message:
        'Check out this awesome app! Download it here: https://play.google.com/store/apps/details?id=com.blpfs&hl=en',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

const UserProfile = () => {
  const navigation = useNavigation();
  const authDispatch = useAuthDispatch();
  const dispatch = useDispatch();
  const genSettings = [{}];

  const {employeeData} = useSelector(state => state.UserProfileLoad);

  const employeelInfo = [
    {
      iconName: 'v-card',
      iconType: 'Entypo',
      infoTitle: 'Employee Id',
      infoData: employeeData?.EmployeeId,
    },
    {
      iconName: 'flow-tree',
      iconType: 'Entypo',
      infoTitle: 'Department',
      infoData: employeeData?.Department,
    },
    {
      iconName: 'user-tie',
      iconType: 'FontAwesome5',
      infoTitle: 'Designation',
      infoData: employeeData?.Designation,
    },
    {
      iconName: 'phone',
      iconType: 'AntDesign',
      infoTitle: 'Contact No',
      infoData: employeeData?.MobileNumber,
    },
  ];
  const handleSignout = async () => {
    try {
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('loggedInData');
      await axios.get(`${baseUrl}${adfsLogoutUrl}`);
    } catch (error) {
      console.log(error);
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: 'Signout error!',
      // });
    } finally {
      authDispatch({type: 'LOGOUT'});
      navigation.navigate('Login');
    }
  };
  useEffect(() => {
    dispatch(setProfileHeaderShow(false));
  }, [dispatch]);

  const handleGenInfoItem = ({url, title}) => {
    if (url !== '') {
      navigation.navigate(url, {
        title: title,
      });
    }
  };
  return (
    <SafeAreaView style={{backgroundColor:blBgColors.defaultBackground}} >
      <StatusBar 
        barStyle="dark-content"
        
      />
    <ScrollView>
      <HomeHeaderView title={'Profile'} />
      <View style={styles.container}>
        <View style={styles.profileTop}>
          <View style={styles.profileImage}>
            <ImageComponent byteArray={employeeData?.ThumbnailPhoto} />
          </View>
          <Text style={styles.profileName}>{employeeData?.EmployeeName}</Text>
          <Text style={styles.profileEmail}>{employeeData?.Email}</Text>
        </View>
        <View style={styles.profileMid}>
          <View style={styles.portionTitle}>
            <Text style={styles.portionTitleText}>Employee Information</Text>
            <View style={styles.Info}>
              {employeelInfo.map((item, index) => (
                <View style={styles.infoItem} key={index}>
                  <DynamicIcon
                    iconName={item.iconName}
                    iconType={item.iconType}
                    iconSize={24}
                  />
                  <Text style={styles.infoTitle}>{item?.infoTitle}</Text>
                  <Text style={{paddingHorizontal: 10}}>:</Text>
                  <Text style={{flex: 1}}>{item?.infoData}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.profileEnd}>
          <View style={styles.portionTitle}>
            <Text style={styles.portionTitleText}>General Information</Text>
            <View style={styles.Info}>
              {/* {generalInfo.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    handleGenInfoItem({
                      url: item.componentName,
                      title: item.infoTitle,
                    })
                  }
                  style={styles.infoItem}
                  key={index}>
                  <DynamicIcon
                    iconName={item.iconName}
                    iconType={item.iconType}
                    iconSize={24}
                  />
                  <Text style={styles.infoTitle}>{item.infoTitle}</Text>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <DynamicIcon iconName={'angle-right'} iconSize={24} />
                  </View>
                </TouchableOpacity>
              ))} */}
              <TouchableOpacity onPress={shareApp} style={styles.infoItem}>
                <DynamicIcon
                  iconName={'share-alt'}
                  iconType={'FontAwesome'}
                  iconSize={24}
                />
                <Text style={styles.infoTitle}>Share This App</Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <DynamicIcon iconName={'angle-right'} iconSize={24} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.Info}>
              <TouchableOpacity
                style={styles.infoItem}
                onPress={() => handleSignout()}>
                <DynamicIcon
                  iconName={'logout'}
                  iconType={'AntDesign'}
                  iconSize={24}
                />
                <Text style={styles.infoTitle}>Logout</Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}></View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: blBgColors.defaultBackground,
    flex: 1,
  },
  profileTop: {
    alignItems: 'center',
    minWidth: '100%',
    paddingVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  profileName: {
    fontSize: blFontSize.subTitle,
    fontWeight: '900',
    color: '#000',
  },
  profileEmail: {
    fontSize: blFontSize.bodyLarge,
    color: '#000',
  },
  profileMid: {},
  portionTitle: {
    backgroundColor: blBgColors.bgTitle1,
  },
  portionTitleText: {
    fontSize: blFontSize.subTitle,
    paddingLeft: 20,
    paddingVertical: 10,
    color: blFontColor.TitleColor1,
  },
  Info: {
    backgroundColor: blBgColors.defaultBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
  },
  infoTitle: {
    paddingLeft: 20,
    fontSize: blFontSize.bodyLarge,
    fontWeight: '800',
  },
  iconArrow: {},
  profileEnd: {
    backgroundColor: blBgColors.defaultBackground,
  },
});
