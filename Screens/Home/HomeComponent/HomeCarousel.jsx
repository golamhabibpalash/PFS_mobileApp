import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  blBgColors,
  blFontColor,
  blFontSize,
} from '../../../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {FetchParkingData} from '../../../Services/ParkingServices/SecurityParkingAccessSlice';
import DynamicIcon from '../../../Components/DynamicIcon';
import {
  fetchCafeSlideData,
  loadSliderData,
} from '../../../Services/CommonServices/HomeScreenSliderSlice';
import Loader from '../../../Components/Loader';

const colors = [blBgColors.banglalink, blBgColors.toffee];

const HomeCarousel = () => {
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const {isLoading, parkingData} = useSelector(
    state => state.securityParkingAccess,
  );
  const {cafeData} = useSelector(state => state.CafeteriaSliderData);
  const {homeSliderData} = useSelector(state => state.HomePageSliderData);

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
            daysType: 'Next Day (' + cafeData.NextWorkingData + ')',
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
  const fetchData = () => {
    dispatch(FetchParkingData());
    dispatch(fetchCafeSlideData());
    dispatch(loadSliderData({processedParkingData, processedCafeteriaData}));
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
    fetchData();
  };
  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(-1);
    }
    fetchData();
  };

  const handleIndexChange = () => {
    fetchData();
  };
  useEffect(() => {
    // dispatch(FetchParkingData());
    // dispatch(fetchCafeSlideData());
    dispatch(loadSliderData({processedParkingData, processedCafeteriaData}));
  }, []);

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsButtons={true}
        loop={false}
        autoplay={false}
        showsPagination={true}
        dotColor={blFontColor.BLLigntGray}
        activeDotColor={blFontColor.BLDefaultColour}
        pagingEnabled={true}
        automaticallyAdjustContentInsets={true}
        onIndexChanged={handleIndexChange}
        prevButton={
          <TouchableOpacity
            style={styles.buttonIconWrapper}
            onPress={goToPrevSlide}>
            <DynamicIcon
              iconName={'leftcircle'}
              iconType={'AntDesign'}
              iconSize={24}
              iconColor={'#fff'}
            />
          </TouchableOpacity>
        }
        nextButton={
          <TouchableOpacity
            style={styles.buttonIconWrapper}
            onPress={goToNextSlide}>
            <DynamicIcon
              iconName={'rightcircle'}
              iconType={'AntDesign'}
              iconSize={24}
              iconColor={'#000'}
            />
          </TouchableOpacity>
        }>
        {homeSliderData &&
          homeSliderData.map(item => (
            <LinearGradient
              style={styles.gradientStyle}
              colors={colors}
              key={item.id}
              start={{x: 0, y: 0.9}}
              end={{x: 1, y: 0.8}}>
              <View style={styles.slide}>
                <Text style={styles.title}>
                  {' '}
                  {item.title}{' '}
                  {item.sliderType === 'parking' && 'Parking Status'}
                </Text>
                {item.sliderType === 'parking' &&
                  item.data.map(pItem => (
                    <View
                      style={styles.textInfoContainer}
                      key={pItem.VehicleType}>
                      <Text style={[styles.textInfoColumn1]}>
                        {pItem.VehicleType} -
                      </Text>
                      <Text style={styles.textInfoColumn2}>
                        {pItem.OcupiedParkingSpace}/{pItem.TotalParkingSpace}
                      </Text>
                    </View>
                  ))}
                {item.sliderType === 'cafeteria' &&
                  item.data.map(pItem => (
                    <View style={styles.textInfoContainer} key={pItem.daysType}>
                      <Text style={[styles.textInfoColumn3]}>
                        {pItem.daysType}
                      </Text>
                      <Text style={styles.textInfoColumn4}>{pItem.status}</Text>
                    </View>
                  ))}
              </View>
            </LinearGradient>
          ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonIconWrapper: {
    backgroundColor: 'transparent',
    opacity: 0.3,
    margin: 5,
  },
  wrapper: {
    resizeMode: 'contain',
  },
  gradientStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderRadius: 8,
    elevation: 5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: blFontSize.title,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 5,
  },
  infoTextContainer: {
    padding: 10,
  },
  infoText: {
    fontSize: blFontSize.bodyLarge,
    color: '#fff',
  },
  pagination_x: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textInfoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    borderBottomWidth: 0.25,
    borderColor: '#ddd',
  },
  textInfoColumn1: {
    flex: 8,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
  },
  textInfoColumn2: {
    flex: 2,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
    textAlign: 'right',
  },

  textInfoColumn3: {
    flex: 6,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
  },
  textInfoColumn4: {
    flex: 4,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
    textAlign: 'right',
  },
  cafeTextInfoColumn1: {
    flex: 7,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
  },
  cafeTextInfoColumn2: {
    flex: 3,
    margin: 3,
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
    textAlign: 'right',
  },
});

export default HomeCarousel;
