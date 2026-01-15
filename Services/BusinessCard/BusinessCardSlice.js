import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBusinessCardData } from './BusinessApis';
import { getBusinessCardCreateData, CreateBusinessCard } from './BusinessApis';


export const FetchRequestData = createAsyncThunk(
    'RequestData/fetchRequestData',
    async (page) => {
        const requestData = await getBusinessCardData(page);
        return requestData.data;
    },
);
export const FetchRequestCreateData = createAsyncThunk(
    'RequestData/fetchRequesCreatetData',
    async () => {
        const requestCreateData = await getBusinessCardCreateData();
        return requestCreateData.data;
    },
);
export const CreateBusinessCardData = createAsyncThunk(
    'CreateData/createBusinessCardData',
    async (model) => {
        const response = await CreateBusinessCard(model);
        return response.data;
    },
);
// Slice 
const requestDataSlice = createSlice({
    name: 'RequestData',
    initialState: {
        isLoading: false,
        isError: false,
        error: null,
        requestData: [],
    },
    extraReducers: builder => {
        builder
            .addCase(FetchRequestData.pending, state => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(FetchRequestData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.requestData = action.payload;
            })
            .addCase(FetchRequestData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});
const createLoadDataSlice = createSlice({
    name: 'CreateLoadData',
    initialState: {
        isLoading: false,
        isError: false,
        error: null,
        createLoadData: {},
    },
    extraReducers: builder => {
        builder
            .addCase(FetchRequestCreateData.pending, state => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(FetchRequestCreateData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.createLoadData = action.payload;
            })
            .addCase(FetchRequestCreateData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});
const createDataSlice = createSlice({
    name: 'CreateData',
    initialState: {
        isLoading: false,
        isError: false,
        error: null,
        responseData: null,
    },
    extraReducers: builder => {
        builder
            .addCase(CreateBusinessCardData.pending, state => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(CreateBusinessCardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.responseData = action.payload;
            })
            .addCase(CreateBusinessCardData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            });
    },
});

export const requestDataReducer = requestDataSlice.reducer;
export const createLoadDataReducer = createLoadDataSlice.reducer;
export const createDataReducer = createDataSlice.reducer;
