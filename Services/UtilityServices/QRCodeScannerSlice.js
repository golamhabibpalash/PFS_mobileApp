import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  scaneData: '',
};

const QRCodeScannerSlice = createSlice({
  name: 'QRData',
  initialState,
  reducers: {
    setQRData: (state, action) => {
      state.scaneData = action.payload;
    },
  },
});

export default QRCodeScannerSlice.reducer;
export const {setQRData} = QRCodeScannerSlice.actions;
