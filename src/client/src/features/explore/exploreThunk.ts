import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {useSelectorType} from '../../store';

export const getAllUsers = createAsyncThunk('explore/getAllUsers', async(_, thunkAPI) => {
    try {
        const {search, page} = (thunkAPI.getState() as useSelectorType).explore;
        const response = await axios.get(`/api/v1/user?search=${search}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getTrendingTopics = createAsyncThunk('explore/getTrendingTopics', async(_, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/post/trending`);
        const data = response.data;
        return data.trending;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getTrendingBoxInformation = createAsyncThunk('explore/getTrendingBoxInformation', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/post/trending');
        const data = response.data;
        return data.trending;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});