import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { getSinglePostComments } from '../singlePost/singlePostThunk';

export const createPost = createAsyncThunk('post/createPost', async(postData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/post', postData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const likePost = createAsyncThunk('post/likePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/post/${postID}/like`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unlikePost = createAsyncThunk('post/unlikePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/post/${postID}/unlike`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createComment = createAsyncThunk('post/createComment', async(postData: {id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/post/${postData.id}/comment`, postData.data);
        const data = response.data;
        thunkAPI.dispatch(getSinglePostComments(postData.id));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});