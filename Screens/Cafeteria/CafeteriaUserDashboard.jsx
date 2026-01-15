import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect} from 'react';
import CafeteriaUserDashboardCalender from './CafeComponent/CafeteriaUserDashboardCalender';
import CafeteriaUserDashboardDisplay from './CafeComponent/CafeteriaUserDashboardDisplay';
import {blBgColors, blFontColor, blFontSize} from '../../App/Accessibilities';
import {FetchCafeteriaDashboardData} from '../../Services/CafeteriaServices/CafeteriaDashboardSlice';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const CafeteriaUserDashboard = () => {
  const date = new Date();
  const pMonth = date.getMonth();
  const pYear = date.getFullYear();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchCafeteriaDashboardData());
    // dispatch(calendarMonthChanged({pMonth, pYear}));
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.topNavigationButtonWrapper}>
            <TouchableOpacity
              style={styles.topNavigationBtn}
              onPress={() => {
                navigation.navigate('CafeRegistration', {
                  title: 'Lunch Registration',
                });
              }}>
              <Text style={styles.topNavigationBtnText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topNavigationBtn}
              onPress={() => {
                navigation.navigate('CafeAvailLunch', {
                  title: 'Avail Lunch',
                });
              }}>
              <Text style={styles.topNavigationBtnText}>Avail Meal</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calenderPart}>
            <CafeteriaUserDashboardCalender />
          </View>
          <View style={styles.displayPart}>
            <CafeteriaUserDashboardDisplay />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CafeteriaUserDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topNavigationButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  topNavigationBtn: {
    width: 150,
    padding: 10,
    borderRadius: 8,
    backgroundColor: blBgColors.banglalink50,
    margin: 5,
  },
  topNavigationBtnText: {
    fontSize: blFontSize.bodyLarge,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  calenderPart: {
    padding: 10,
  },
  displayPart: {
    margin: 5,
  },
  indicationSection: {
    padding: 10,
    alignItems: 'center',
  },
  indicatorText: {
    color: blFontColor.BLDefaultColour,
  },
});
