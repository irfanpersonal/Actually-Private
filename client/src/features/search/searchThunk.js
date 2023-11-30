import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const searchUsers = createAsyncThunk('search/searchUsers', async(_, thunkAPI) => {
    try {
        const {search, page} = thunkAPI.getState().search;
        const response = await axios.get(`/api/v1/users?search=${search}&page=${page}`);
        const data = response.data;
        return data;
    }   
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});