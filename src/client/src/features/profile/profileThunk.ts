import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getProfileData = createAsyncThunk('profile/getProfileData', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/getProfileData');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getProfilePosts = createAsyncThunk('profile/getProfilePosts', async(_, thunkAPI) => {
    try {
        const {profile: {page}} = thunkAPI.getState() as useSelectorType;
        const response = await axios.get(`/api/v1/user/getUsersPosts?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('profile/updateUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUser', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});