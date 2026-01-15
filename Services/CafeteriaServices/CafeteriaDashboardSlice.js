import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  FetchCafeteriaDashboardDataAsynch,
  fetchCalendarData,
} from './CafeteriaApis';
import {monthNames} from '../../App/Accessibilities';

//code for finding date
const currentDate = new Date();

// Get the month and year from the currentDate object
const currentMonthName = monthNames[currentDate.getMonth()];
const currentYear = currentDate.getFullYear();

// Combine the month and year
const currentMonthYearText = `${currentMonthName} ${currentYear}`;

//set initial data
const initialState = {
  isLoading: false,
  isError: false,
  error: null,
  displayMonthYear: currentMonthYearText,
  holidays: [],
  usersData: [],
  monthlyData: [],
  monthlyCalenderData: [],
  regCounting: {
    Registered: 0,
    Transferred: 0,
    Cancelled: 0,
    Consumed: 0,
    NonConsumed: 0,
    ReceivedConsumeMsg: 0,
    ReceivedTransferred: 0,
    ReceivedTransferredConsume: 0,
    TransferredConsume: 0,
  },
};
const initialStateCalendar = {
  isLoading: false,
  isError: false,
  error: null,
  calendarData: {},
};

const countRegistrationByType = (monthlyRegData, regType) => {
  return monthlyRegData.reduce(
    (count, d) => (d.ClassName === regType ? count + 1 : count),
    0,
  );
};

const processUserData = (month, year, userData) => {
  return userData.filter(d => {
    const startDate = new Date(d.Start);
    return (
      startDate.getFullYear() == year && startDate.getMonth() === month - 1
    );
  });
};

//asynch thunk if needed
export const FetchCafeteriaDashboardData = createAsyncThunk(
  'cafeteria/dashboardData',
  FetchCafeteriaDashboardDataAsynch,
);
export const getCalendarData = createAsyncThunk(
  'cafeteria/userDashboardCalendar',
  async param => {
    // const {pMonth, pYear} = param;
    // const formattedNumber = pMonth.toString().padStart(2, '0');
    const {formatedValue} = param;
    const response = await fetchCalendarData(formatedValue);
    return JSON.stringify(response);
  },
);

//reducer
const UserDashboardDataSlice = createSlice({
  name: 'dashboardData',
  initialState: initialState,
  reducers: {
    cafeDashboardMonthChange: (state, action) => {
      const {pMonth, pYear} = action.payload;
      const monthYearText = monthNames[pMonth] + ' ' + pYear;
      state.displayMonthYear = monthYearText;
    },
    loadCafeUserLunchCounting: (state, action) => {
      const {pMonth, pYear, usersData} = action.payload;
      const monthlyData = processUserData(pMonth + 1, pYear, usersData);
      state.regCounting.Registered = countRegistrationByType(
        monthlyData,
        'Registered',
      );

      state.regCounting.Transferred = countRegistrationByType(
        monthlyData,
        'Transferred',
      );

      state.regCounting.Cancelled = countRegistrationByType(
        monthlyData,
        'Cancelled',
      );

      state.regCounting.Consumed = countRegistrationByType(
        monthlyData,
        'Consumed',
      );

      state.regCounting.NonConsumed = countRegistrationByType(
        monthlyData,
        'NonConsumed',
      );

      state.regCounting.ReceivedConsumeMsg = countRegistrationByType(
        monthlyData,
        'ReceivedConsumeMsg',
      );

      state.regCounting.ReceivedTransferred = countRegistrationByType(
        monthlyData,
        'ReceivedTransferred',
      );

      state.regCounting.ReceivedTransferredConsume = countRegistrationByType(
        monthlyData,
        'ReceivedTransferredConsume',
      );

      state.regCounting.TransferredConsume = countRegistrationByType(
        monthlyData,
        'TransferredConsume',
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(FetchCafeteriaDashboardData.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(FetchCafeteriaDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;
        state.holidays = action.payload.HolidayList;
        state.usersData = action.payload.UserStatusList;
      })
      .addCase(FetchCafeteriaDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
  },
});
const UserDashboardCalendarDataSlice = createSlice({
  name: 'calendarData',
  initialState: initialStateCalendar,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCalendarData.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.error = '';
      })
      .addCase(getCalendarData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.error = '';
        state.calendarData = action.payload;
      })
      .addCase(getCalendarData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
        state.calendarData = {};
      });
  },
});

//export reducer
export const UserDashboardDataReducer = UserDashboardDataSlice.reducer;
export const UserDashboardCalendarDataReducer =
  UserDashboardCalendarDataSlice.reducer;

//export actions
export const {cafeDashboardMonthChange} = UserDashboardDataSlice.actions;
export const {loadCafeUserLunchCounting} = UserDashboardDataSlice.actions;
