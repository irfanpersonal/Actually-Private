import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getCurrentUserPosts = createAsyncThunk('posts/getCurrentUserPosts', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/posts/getCurrentUserPosts');
        const data = response.data;
        return data.posts;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const likePost = createAsyncThunk('posts/likePost', async({postID, userID}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/posts/likePost/${postID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unlikePost = createAsyncThunk('posts/unlikePost', async({postID, userID}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/posts/unlikePost/${postID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getUserFeed = createAsyncThunk('posts/getUserFeed', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/posts/userFeed');
        const data = response.data;
        return data.posts;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/posts');
        const data = response.data;
        return data; 
    }   
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});