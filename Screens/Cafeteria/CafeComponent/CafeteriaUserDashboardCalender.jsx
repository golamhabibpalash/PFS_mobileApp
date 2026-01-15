import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {blBgColors, blFontColor} from '../../../App/Accessibilities';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  cafeDashboardMonthChange,
  getCalendarData,
  loadCafeUserLunchCounting,
} from '../../../Services/CafeteriaServices/CafeteriaDashboardSlice';
import {ActivityIndicator} from 'react-native-paper';

const CafeteriaUserDashboardCalender = () => {
  const [cafeCalendarLoaded, setCafeCalendarLoaded] = useState(false);
  const dispatch = useDispatch();
  const {
    holidays: pHolidays,
    usersData,
    isLoading,
    isError,
    error,
  } = useSelector(state => state.CafeteriaDashboard);
  const {isLoading: cafeCalendarIsLoading, calendarData} = useSelector(
    state => state.CafeteraiDashboardCalender,
  );

  const cafeMealStatusTypeColor = [
    {
      key: 'Registered',
      color: '#41B8D5',
    },
    {
      key: 'Cancelled',
      color: '#FE6D73',
    },
    {
      key: 'Consumed',
      color: '#7ED957',
    },
    {
      key: 'Transferred',
      color: '#CB6CE6',
    },
  ];
  const markedDates = () => {
    return JSON.parse(calendarData);
  };
  const Holiday = {
    key: 'Holiday',
    color: '#000',
    selectedDayBackgroundColor: 'red',
  };

  const setMarkedDates = () => {
    const markedDates = {};
    pHolidays.forEach(holiday => {
      const date = holiday.Start;

      if (!markedDates[date]) {
        markedDates[date] = [];
      }

      // Add dots based on different conditions
      if (holiday.ClassName === 'fc-holiday') {
        markedDates[date].push(Holiday);
      }
    });

    // Convert the object into the required format
    const formattedMarkedDates = {};
    Object.keys(markedDates).forEach(date => {
      formattedMarkedDates[date] = {
        dots: markedDates[date],
        marked: true,
      };
    });

    return formattedMarkedDates;
  };

  const getTitleOfDay = dayDate => {
    const holiday = pHolidays.find(item => item.Start === dayDate);
    return holiday ? holiday.Title : null;
  };
  handleOnDayPress = d => {
    const title = getTitleOfDay(d.dateString);
    title !== null &&
      Toast.show({
        type: 'info',
        text1: 'Holiday',
        text2: title,
      });
  };

  handleMonthChanged = d => {
    const date = new Date(d.dateString);
    const pMonth = date.getMonth();
    const pYear = date.getFullYear();
    dispatch(cafeDashboardMonthChange({pMonth, pYear}));
    dispatch(loadCafeUserLunchCounting({pMonth, pYear, usersData}));
    const formatedMonth = (pMonth + 1).toString().padStart(2, '0');
    const formatedValue = formatedMonth + pYear;
    dispatch(getCalendarData({formatedValue})).then(() => {
      if (!cafeCalendarIsLoading) {
        setCafeCalendarLoaded(true);
      }
    });
  };

  useEffect(() => {
    const date = new Date();
    const pMonth = date.getMonth();
    const pYear = date.getFullYear();
    dispatch(cafeDashboardMonthChange({pMonth, pYear}));
    dispatch(loadCafeUserLunchCounting({pMonth, pYear, usersData}));
    const formatedMonth = (pMonth + 1).toString().padStart(2, '0');
    const formatedValue = formatedMonth + pYear;
    dispatch(getCalendarData({formatedValue})).then(() => {
      if (!cafeCalendarIsLoading) {
        setCafeCalendarLoaded(true);
      }
    });
  }, [dispatch]);

  return (
    !isLoading && (
      <View style={styles.calenderContainer}>
        {cafeCalendarLoaded === true ? (
          <Calendar
            style={styles.calender}
            onMonthChange={day => handleMonthChanged(day)}
            markedDates={markedDates()}
            markingType={'multi-dot'}
            onDayPress={day => {
              handleOnDayPress(day);
            }}
            theme={{
              monthTextColor: '#666',
              textMonthFontWeight: 'bold',
              textSectionTitleColor: '#000',
              todayBackgroundColor: blBgColors.banglalink50,
              todayTextColor: blFontColor.BLLigntGray,
              arrowColor: '#000',
              dotColor: 'red',
              'stylesheet.calendar.header': {
                week: {
                  backgroundColor: '',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  styles: {color: '#109D8F'},
                },
              },
              'stylesheet.dot': {
                dot: {
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginTop: 1,
                  marginLeft: 0,
                  marginRight: 0,
                },
              },
            }}
          />
        ) : (
          <ActivityIndicator />
        )}
        <View style={{padding: 10}}>{/* <Legend /> */}</View>
      </View>
    )
  );
};

export default CafeteriaUserDashboardCalender;

const styles = StyleSheet.create({
  calenderContainer: {
    margin: 5,
  },
  calender: {
    borderRadius: 8,
    elevation: 2,
  },
  indicationSection: {
    padding: 10,
    alignItems: 'center',
  },
  indicatorText: {
    color: blFontColor.BLDefaultColour,
  },
});
