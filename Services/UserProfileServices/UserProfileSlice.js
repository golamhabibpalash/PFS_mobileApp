import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getUserData} from './UserProfileApis';

//Initial State
const initialState = {
  isLoading: false,
  isError: false,
  employeeData: {},
  message: null,
  isProfileHeaderShow: true,
};
export const FetchUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async () => {
    try {
      const response = await getUserData();
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  },
);
//Reducer
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: initialState,
  reducers: {
    setProfileHeaderShow: (state, action) => {
      state.isProfileHeaderShow = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(FetchUserProfile.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(FetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeData = action.payload;
        state.isError = false;
        state.message = null;
      })
      .addCase(FetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.employeeData = {};
        state.isError = true;
        state.message = action.payload;
      });
  },
});

//Export reducers
export default userProfileSlice.reducer;

//Export actions
export const {setProfileHeaderShow} = userProfileSlice.actions;
