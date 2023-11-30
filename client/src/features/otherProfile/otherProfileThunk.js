import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const followUser = createAsyncThunk('otherProfile/followUser', async(userID, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/users/followUser/${userID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unfollowUser = createAsyncThunk('otherProfile/unfollowUser', async(userID, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/users/unfollowUser/${userID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

