import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getUserProfileData = createAsyncThunk('profile/getUserProfileData', async(userID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/users/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});