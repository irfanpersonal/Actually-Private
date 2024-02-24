import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleUser = createAsyncThunk('singleUser/getSingleUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleUserPosts = createAsyncThunk('singleUser/getSingleUserPosts', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}/getSingleUserPosts`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const followUser = createAsyncThunk('singleUser/followUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/user/${userID}/follow`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unfollowUser = createAsyncThunk('singleUser/unfollowUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/user/${userID}/unfollow`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createFollowRequest = createAsyncThunk('singleUser/createFollowRequest', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/user/${userID}/followRequest`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteFollowRequest = createAsyncThunk('singleUser/deleteFollowRequest', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/user/${userID}/followRequest`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const blockUser = createAsyncThunk('singleUser/blockUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/user/${userID}/block`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unblockUser = createAsyncThunk('singleUser/unblockUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/user/${userID}/unblock`);
        const data = response.data;
        thunkAPI.dispatch(getSingleUserPosts(userID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});