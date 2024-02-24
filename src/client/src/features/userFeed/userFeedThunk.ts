import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getUserFeed = createAsyncThunk('userFeed/getUserFeed', async(_, thunkAPI) => {
    try {
        const {page} = (thunkAPI.getState() as useSelectorType).userFeed;
        const response = await axios.get(`/api/v1/post/userFeed?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});