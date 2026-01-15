import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getRegistrtaionInfosAsynch,
  submitRegistrationAsynch,
} from './CafeteriaApis';
import Loader from '../../Components/Loader';

const initialState = {
  data: '',
  status: '',
  error: '',
  message: '',
  isSuccess: false,
};

//initial data
const registerInitialData = {
  isLoading: false,
  isError: false,
  error: '',
  locations: [],
  vendors: [],
  quickOptions: [],
  NextWorkingDate: '',
};
const qOptoins = [
  {Text: 'Next 1 Day', Value: 1},
  {Text: 'Next 5 Days', Value: 5},
  {Text: 'Next 30 Days', Value: 30},
  {Text: 'Choose Date', Value: 0},
];

//custom method
export const getRegistrationInfo = createAsyncThunk(
  'cafeteria/RegistrationIndex',
  async param => {
    const model = param;
    const response = await getRegistrtaionInfosAsynch();
    return response;
  },
);

//create slice and reducer
const cafeteriaRegistrationDataSlice = createSlice({
  name: 'cafeteriaRegistrationSlice',
  initialState: registerInitialData,
  reducers: {
    clearRegistrationData(state) {
      state.isLoading = false;
      state.isError = false;
      state.error = '';
      state.locations = [];
      state.vendors = [];
      state.quickOptions = qOptoins;
      state.NextWorkingDate = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getRegistrationInfo.pending, state => {
        state.isError = false;
        state.isLoading = true;
        state.error = '';
        state.locations = [];
        state.vendors = [];
        state.NextWorkingDate = '';
      })
      .addCase(getRegistrationInfo.fulfilled, (state, action) => {
        const { AvailableLocations, AvailableVendors, NextWorkingDate} = action.payload;
        state.isError = false;
        state.isLoading = false;
        state.error = '';
        state.locations = AvailableLocations.filter(
          item => item.Value !== '',
        );
        state.vendors = AvailableVendors.filter(item => item.Value !== '');
        state.quickOptions = qOptoins;
        state.NextWorkingDate = NextWorkingDate;
      })
      .addCase(getRegistrationInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
        state.locations = [];
        state.vendors = [];
        state.NextWorkingDate = '';
      });
  },
});

export const registerFood = createAsyncThunk(
  'foodRegistration/registerFood',
  async params => {
    const foodRegistrationData = params;
    try {
      const response = await submitRegistrationAsynch(foodRegistrationData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to register food. Please try again.');
    }
  },
);

const foodRegistrationSlice = createSlice({
  name: 'foodRegistration',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerFood.pending, state => {
        state.status = 'loading';
        state.isSuccess = false;
      })
      .addCase(registerFood.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
        state.isSuccess = action.payload.IsSuccess;
      })
      .addCase(registerFood.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

//export reducer
export const cafeteriaRegistrationDataReducer =
  cafeteriaRegistrationDataSlice.reducer;
export const cafeteriaRegistrationReducer = foodRegistrationSlice.reducer;

// Export action creators
export const {clearRegistrationData} = cafeteriaRegistrationDataSlice.actions;
