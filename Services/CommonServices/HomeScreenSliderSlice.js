import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getCafeSliceData} from './CommonApis';

const initialData = {
  homeSliderData: [
    // {
    //   id: 1,
    //   title: 'TD Parking Status',
    //   sliderType: 'parking',
    //   data: [
    //     {
    //       VehicleType: 'Vehicle 1',
    //       OcupiedParkingSpace: 10,
    //       TotalParkingSpace: 24,
    //     },
    //     {
    //       VehicleType: 'Vehicle 2',
    //       OcupiedParkingSpace: 5,
    //       TotalParkingSpace: 15,
    //     },
    //     {
    //       VehicleType: 'Vehicle 3',
    //       OcupiedParkingSpace: 6,
    //       TotalParkingSpace: 19,
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   title: 'TDex Parking Status',
    //   sliderType: 'parking',
    //   data: [
    //     {
    //       VehicleType: 'Vehicle 4',
    //       OcupiedParkingSpace: 6,
    //       TotalParkingSpace: 30,
    //     },
    //     {
    //       VehicleType: 'Vehicle 5',
    //       OcupiedParkingSpace: 0,
    //       TotalParkingSpace: 10,
    //     },
    //     {
    //       VehicleType: 'Vehicle 6',
    //       OcupiedParkingSpace: 2,
    //       TotalParkingSpace: 11,
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   title: 'Cafeteria Lunch Status',
    //   sliderType: 'cafeteria',
    //   data: [
    //     {
    //       daysType: 'Today',
    //       status: 'Consumed',
    //     },
    //     {
    //       daysType: 'Tomorrow',
    //       status: 'Registered',
    //     },
    //   ],
    // },
  ],
};

const initialDataCafeteria = {
  isLoading: false,
  isError: false,
  error: '',
  cafeData: {},
};

export const fetchCafeSlideData = createAsyncThunk(
  'cafeteria/cafeSliderData',
  async () => {
    const respose = await getCafeSliceData();
    return respose;
  },
);

const cafeteriaDataSlice = createSlice({
  name: 'cafeSliderData',
  initialState: initialDataCafeteria,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCafeSlideData.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCafeSlideData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.cafeData = action.payload;
      })
      .addCase(fetchCafeSlideData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
  },
});

const homePageSliderSlice = createSlice({
  name: 'homePageSlider',
  initialState: initialData,
  reducers: {
    loadSliderData: (state, action) => {
      const {processedParkingData, processedCafeteriaData} = action.payload;
      const combinedData = [...processedParkingData, ...processedCafeteriaData];
      state.homeSliderData = combinedData;
    },
  },
});

//export reducer
export const HomePageSliderReducer = homePageSliderSlice.reducer;
export const CafeteriaSliderReducer = cafeteriaDataSlice.reducer;

//export actions
export const {loadSliderData} = homePageSliderSlice.actions;
