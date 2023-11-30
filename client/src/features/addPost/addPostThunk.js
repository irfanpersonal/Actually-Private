import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const createPost = createAsyncThunk('addPost/createPost', async(post, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/posts`, post);
        const data = response.data;
        return data.post;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSinglePost = createAsyncThunk('addPost/getSinglePost', async(postID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/posts/${postID}`);
        const data = response.data;
        return data.post;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSinglePost = createAsyncThunk('addPost/editSinglePost', async({postID, post}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/posts/${postID}`, post);
        const data = response.data;
        return data.post;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSinglePost = createAsyncThunk('addPost/deleteSinglePost', async(postID, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/posts/${postID}`);
        const data = response.data;
        return data.post;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});