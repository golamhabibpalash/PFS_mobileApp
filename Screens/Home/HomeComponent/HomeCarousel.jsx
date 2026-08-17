import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  blBgColors,
  blFontColor,
  blFontSize,
} from '../../../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import DynamicIcon from '../../../Components/DynamicIcon';

const colors = [blBgColors.banglalink, blBgColors.toffee];

const HomeCarousel = () => {
  const {homeSliderData} = useSelector(state => state.HomePageSliderData);

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        loop={false}
        autoplay={false}
        showsPagination={true}
        dotColor={blFontColor.BLLigntGray}
        activeDotColor={blFontColor.BLDefaultColour}
        pagingEnabled={true}
        automaticallyAdjustContentInsets={true}
        prevButton={
          <View style={styles.buttonIconWrapper}>
            <DynamicIcon
              iconName={'leftcircle'}
              iconType={'AntDesign'}
              iconSize={24}
              iconColor={'#fff'}
            />
          </View>
        }
        nextButton={
          <View style={styles.buttonIconWrapper}>
            <DynamicIcon
              iconName={'rightcircle'}
              iconType={'AntDesign'}
              iconSize={24}
              iconColor={'#000'}
            />
          </View>
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
