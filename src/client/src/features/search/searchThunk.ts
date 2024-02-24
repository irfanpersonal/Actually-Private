import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getGlobalSearch = createAsyncThunk('search/getGlobalSearch', async(_, thunkAPI) => {
    try {
        const {search, page} = (thunkAPI.getState() as useSelectorType).search;
        const response = await axios.get(`/api/v1/post/globalSearch?search=${search}&page=${page}`);
        const data = response.data;
        thunkAPI.dispatch(getSuggestedUsers());
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSuggestedUsers = createAsyncThunk('explore/getAllUsers', async(_, thunkAPI) => {
    try {
        const {search} = (thunkAPI.getState() as useSelectorType).search;
        const response = await axios.get(`/api/v1/user?search=${search}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});