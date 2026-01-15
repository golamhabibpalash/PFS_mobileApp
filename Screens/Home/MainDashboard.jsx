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
import React, {useEffect, useState, useCallback} from 'react';
// import {TouchableOpacity} from 'react-native-gesture-handler';
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
import {FetchParkingData} from '../../Services/ParkingServices/SecurityParkingAccessSlice';
import {
  fetchCafeSlideData,
  loadSliderData,
} from '../../Services/CommonServices/HomeScreenSliderSlice';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Components/Loader';
import {ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const MainDashboard = () => {
  const authState = useAuthState();
  const navigation = useNavigation();
  const [sliderDataLoad, setSliderDataLoad] = useState(false);

  const {employeeData, isProfileHeaderShow} = useSelector(
    state => state.UserProfileLoad,
  );

  const {isLoading, parkingData} = useSelector(
    state => state.securityParkingAccess,
  );
  const {cafeData} = useSelector(state => state.CafeteriaSliderData);
  const {dynamicMenu, setDynamicMenu} = useState(authState.DynamicMenu);

  let processedCafeteriaData = [];
  if (cafeData !== null) {
    processedCafeteriaData = [
      {
        id: 3,
        title: 'Cafeteria Lunch Status',
        sliderType: 'cafeteria',
        data: [
          {
            daysType: 'Today',
            status: cafeData.TodaysStatus,
          },
          {
            daysType: 'Tomorrow',
            status: cafeData.NextDaysStatus,
          },
        ],
      },
    ];
  }

  let sliderId = 0;
  const processedParkingData = parkingData.map(parkingLocation => {
    sliderId++;
    const {ParkingLocationId, ParkingLocation, ParkingSpaceInfoLists} =
      parkingLocation;

    const uniqueParkingSpaces = parkingLocation.ParkingSpaceInfoLists.reduce(
      (acc, spaceInfo) => {
        const existingIndex = acc.findIndex(
          space => space.VehicleType === spaceInfo.VehicleType,
        );
        if (existingIndex !== -1) {
          acc[existingIndex].TotalParkingSpace += spaceInfo.TotalParkingSpace;
          acc[existingIndex].FreeParkingSpace += spaceInfo.FreeParkingSpace;
          acc[existingIndex].OcupiedParkingSpace +=
            spaceInfo.OcupiedParkingSpace;
        } else {
          acc.push(spaceInfo);
        }
        return acc;
      },
      [],
    );

    return {
      id: sliderId,
      sliderType: 'parking',
      title: ParkingLocation,
      icon: '',
      color: '#000',
      data: uniqueParkingSpaces,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProfileHeaderShow(true));

    dispatch(fetchCafeSlideData())
      .then(() => dispatch(FetchParkingData()))
      .then(parkingData => {
        if (processedParkingData && processedCafeteriaData && parkingData) {
          !isLoading &&
            (setSliderDataLoad(true),
            dispatch(
              loadSliderData({
                processedParkingData,
                processedCafeteriaData,
              }),
            ));
        } else {
          console.log('Processed data not yet available for loading slider.');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
