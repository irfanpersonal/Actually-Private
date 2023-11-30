import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const registerUser = createAsyncThunk('user/registerUser', async(user, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/register', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async(user, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/login', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const showCurrentUser = createAsyncThunk('user/showCurrentUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/users/showCurrentUser');
        const data = response.data;
        return data.user; 
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/auth/logout');
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('user/updateUser', async(user, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/users/updateUser', user);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});