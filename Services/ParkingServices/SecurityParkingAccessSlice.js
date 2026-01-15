import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getParkingData,
  getParkingEmployeeInfo,
  processParkingTransaction,
} from './ParkingApis';

//Thunk make kora hoyece Parking Data (async) call korar jonno 1
export const FetchParkingData = createAsyncThunk(
  'parkingData/fetchParkingData',
  async () => {
    const parkingData = await getParkingData();
    return parkingData;
  },
);

export const FetchEmployeeInfo = createAsyncThunk(
  'employeeInfo/fetchEmployeeInfo',
  async params => {
    const {LocationId, EmployeeId, QRCode} = params;
    try {
      const response = await getParkingEmployeeInfo(
        LocationId,
        EmployeeId,
        QRCode,
      );
      return response;
    } catch (error) {
      console.error('Error fetching employee info:', error);
      throw error;
    }
  },
);

export const ParkingTransactionProcess = createAsyncThunk(
  'parkingTransaction/parkingTransactionProcess',
  async params => {
    const parkingAccess = params;
    try {
      const response = await processParkingTransaction(parkingAccess);
      return response;
    } catch (error) {
      console.error('Error fetching process Parking Transaction:', error);
      throw error;
    }
  },
);

//ekhane ekti slice make koreci Parking current status load korar jonno
const parkingDataSlice = createSlice({
  name: 'parkingData',
  initialState: {
    isLoading: false,
    isError: false,
    error: null,
    parkingData: [],
  },
  extraReducers: builder => {
    builder
      .addCase(FetchParkingData.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(FetchParkingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.parkingData = action.payload;
      })
      .addCase(FetchParkingData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
  },
});

//ekhane aro ekti slice make koreci Employee Information load korar jonno
const employeeInfoSlice = createSlice({
  name: 'employeeInfo',
  initialState: {
    isLoading: false,
    isError: false,
    error: null,
    employeeInfo: {},
  },
  reducers: {
    resetEmployeeInfo: (state, action) => {
      state.employeeInfo = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(FetchEmployeeInfo.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(FetchEmployeeInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.employeeInfo = action.payload;
      })
      .addCase(FetchEmployeeInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
  },
});

const parkingTransactoinSlice = createSlice({
  name: 'parkingTransaction',
  initialState: {
    isLoading: false,
    isError: false,
    error: null,
    pTransactionInfo: {},
  },
  reducers: {
    setParkingTransactionInitialData: (state, action) => {
      state.pTransactionInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(ParkingTransactionProcess.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(ParkingTransactionProcess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.pTransactionInfo = action.payload;
      })
      .addCase(ParkingTransactionProcess.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});
// Export Reducers
export const parkingDataReducer = parkingDataSlice.reducer;
export const employeeInfoReducer = employeeInfoSlice.reducer;
export const parkingTransactionReducer = parkingTransactoinSlice.reducer;

//Export Actions
export const {setParkingTransactionInitialData} =
  parkingTransactoinSlice.actions;
export const {resetEmployeeInfo} = employeeInfoSlice.actions;
