import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useAuthState} from '../../Navigation/AuthContext';
import {useDispatch, useSelector} from 'react-redux';
import {loadSubMenus} from '../../Services/CommonServices/ModuleHomeMenuProcessSlice';
import {blBgColors, blFontSize, blFonts} from '../../App/Accessibilities';
import DynamicIcon from '../../Components/DynamicIcon';
import HomeCarousel from './HomeComponent/HomeCarousel';
import {setProfileHeaderShow} from '../../Services/UserProfileServices/UserProfileSlice';
import CustomHeaderComponent from '../../Components/CustomHeaderComponent';
import {useLiveData} from '../../hooks/useLiveData';
import {ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const MainDashboard = () => {
  const authState = useAuthState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sliderDataLoad, setSliderDataLoad] = useState(false);

  const {employeeData} = useSelector(state => state.UserProfileLoad);
  const {homeSliderData} = useSelector(state => state.HomePageSliderData);

  useLiveData();

  useEffect(() => {
    dispatch(setProfileHeaderShow(true));
  }, []);

  useEffect(() => {
    if (homeSliderData?.length > 0) {
      setSliderDataLoad(true);
    }
  }, [homeSliderData]);

  const cardItem = (RootTitle, RootIcon, RootUrl, RootIconType) => {
    if (!RootUrl || !RootTitle.trim()) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          if (RootUrl) {
            dispatch(
              loadSubMenus({
                dynamicMenu: authState.DynamicMenu,
                url: RootUrl,
              }),
            );
            navigation.navigate(RootUrl, {title: RootTitle});
          } else {
            Toast.show({
              type: 'warning',
              text1: 'Not Found',
              text2:
                RootTitle +
                ' is not available in app, you may go https://pfs.banglalink.net/',
            });
          }
        }}>
        {
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <DynamicIcon
                iconStyles={{padding: 5}}
                iconName={RootIcon}
                iconSize={40}
                iconType={RootIconType}
              />
            </View>
            <Text style={styles.cardText}>{RootTitle}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  };

  const getChildNodesWithQuickLink = menu => {
    return menu
      .map((item, index) => ({
        ...item,
        ChildNodes: item.ChildNodes.filter(child => child.ChildQuickLink),
      }))
      .filter(item => item.ChildNodes.length > 0);
  };

  const filteredMenu = getChildNodesWithQuickLink(authState.DynamicMenu);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} barStyle="light-content" />
      {/* <View
        style={{
          backgroundColor:'#000',
          height:100,
          width:2000,
          position:'absolute',
          top:0,left:0,
        }}
      
      /> */}

<LinearGradient
        colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={{
          backgroundColor:'#000',
          height:47,
          width:'100%',
          position:'absolute',
          top:0,left:0,
        }}
        >
        
      </LinearGradient>
      <ScrollView>
        <View>
          <CustomHeaderComponent
            byteArray={employeeData?.ThumbnailPhoto}
            employeeName={employeeData?.EmployeeName}
          />
        </View>
        <View style={styles.carouselWrapper}>
          {sliderDataLoad && <HomeCarousel />}
          {!sliderDataLoad && <ActivityIndicator />}
        </View>
        <View style={styles.quckLinkWrapper}>
          <Text style={styles.quickLinkText}>Quick Links</Text>
          <View style={styles.flatListContainer}>
            {filteredMenu.flatMap(item =>
              item.ChildNodes.map((childItem, index) => (
                <View style={styles.qListWrapper} key={childItem.ChildUrl}>
                  {cardItem(
                    childItem.ChildTitle == 'Dashboard'
                      ? 'Parking Dashboard'
                      : childItem.ChildTitle == 'Registration'
                      ? 'Parking Registration'
                      : childItem.ChildTitle == 'Register'
                      ? 'Cafeteria Registration'
                      : childItem.ChildTitle,

                    childItem.ChildTitle == 'Registration' && Platform.OS == "ios" ? "edit" : childItem.ChildIcon,

                    childItem.ChildUrl,
                    
                    childItem.ChildTitle == 'Registration' && Platform.OS == "ios" ? "FontAwesome5" : childItem.ChildIconType,
                  )}
                </View>
              )),
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: blBgColors.defaultBackground,
    flex: 1,
  },
  carouselWrapper: {
    height: 250,
    justifyContent: 'center',
  },
  quckLinkWrapper: {
    padding: 10,
  },
  quickLinkText: {
    fontSize: blFontSize.subTitle,
    fontWeight: 'bold',
    padding: 10,
  },
  flatListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qListWrapper: {},
  title: {
    width: '100%',
    height: 100,
    backgroundColor: '#F58220',
  },
  titleText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  cardContainer: {
    margin: 3,
  },
  card: {
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: 90,
  },
  cardIcon: {
    color: '#000',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  cardText: {
    textAlign: 'center',
    color: '#000',
    fontSize: blFontSize.body,
    fontFamily: blFonts.regular,
    flexWrap: 'wrap',
  },
});

export default MainDashboard;
