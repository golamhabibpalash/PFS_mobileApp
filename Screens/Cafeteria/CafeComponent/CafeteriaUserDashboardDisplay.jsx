import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  blFontColor,
  blBgColors,
  blFontSize,
} from '../../../App/Accessibilities';
import UserDashboardTile from './UserDashboardTile';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const CafeteriaUserDashboardDisplay = () => {
  const {
    holidays: pHolidays,
    usersData,
    isLoading,
    isError,
    error,
    displayMonthYear,
    monthlyData,
    regCounting,
  } = useSelector(state => state.CafeteriaDashboard);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.indicationSection}>
          <ActivityIndicator color={blFontColor.BLDefaultColour} />
          <Text style={styles.indicatorText}>Loading... Please wait.</Text>
        </View>
      )}
      {!isLoading && (
        <View style={styles.displayWrapper}>
          <Text style={styles.displayTitle}>{displayMonthYear}</Text>

          <View style={styles.tileContainer}>
            <UserDashboardTile
              bgColor={'#fff'}
              iconName={'circle'}
              title="Registered"
              textColor={'#000'}
              iconColor={'#41B8D5'}
              count={regCounting.Registered}
            />
            <UserDashboardTile
              bgColor={'#fff'}
              iconName={'circle'}
              title="Cancelled"
              iconColor={'#FE6D73'}
              count={regCounting.Cancelled}
              textColor={'#000'}
            />
            <UserDashboardTile
              bgColor={'#fff'}
              iconName={'circle'}
              title={'Consumed'}
              iconColor={'#7ED957'}
              count={regCounting.Consumed}
              textColor={'#000'}
            />
            <UserDashboardTile
              bgColor={'#fff'}
              iconName={'circle'}
              title={'Transferred'}
              iconColor={'#CB6CE6'}
              count={regCounting.Transferred}
              textColor={'#000'}
            />
            <UserDashboardTile
              bgColor={'#fff'}
              iconName={'circle'}
              title={'Not Consumed'}
              iconColor={'#d6d6d6'}
              count={regCounting.NonConsumed}
              textColor={'#000'}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CafeteriaUserDashboardDisplay;

const styles = StyleSheet.create({
  wrapper: {},
  container: {},
  displayWrapper: {
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '98%',
    elevation: 3,
  },
  displayTitle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: blFontSize.bodyLarge,
    padding: 10,
    backgroundColor: blBgColors.bgTitle1,
  },
  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  indicationSection: {
    padding: 10,
    alignItems: 'center',
  },
  indicatorText: {
    color: blBgColors.banglalink,
  },
});
