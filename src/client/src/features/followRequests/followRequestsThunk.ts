import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const viewAllFollowRequests = createAsyncThunk('followRequests/viewAllFollowRequests', async(_, thunkAPI) => {
    try {
        const {page} = (thunkAPI.getState() as useSelectorType).followRequests;
        const response = await axios.get(`/api/v1/user/viewAllFollowRequests?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateFollowRequest = createAsyncThunk('followRequests/updateFollowRequest', async(inputData: {followRequestID: string, data: FormData, accepted: boolean}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/user/viewAllFollowRequests/${inputData.followRequestID}`, inputData.data);
        const data = response.data;
        thunkAPI.dispatch(viewAllFollowRequests());
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});