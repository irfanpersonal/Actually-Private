import {createAsyncThunk} from '@reduxjs/toolkit';
import {useSelectorType} from '../../store';
import axios from 'axios';

export const getSinglePost = createAsyncThunk('singlePost/getSinglePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/post/${postID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSinglePost = createAsyncThunk('singlePost/deleteSinglePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/post/${postID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const likeSinglePost = createAsyncThunk('singlePost/likeSinglePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/post/${postID}/like`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unlikeSinglePost = createAsyncThunk('singlePost/unlikeSinglePost', async(postID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/post/${postID}/unlike`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSinglePostComments = createAsyncThunk('singlePost/getSinglePostComments', async(postID: string, thunkAPI) => {
    try {
        const {page} = (thunkAPI.getState() as useSelectorType).singlePost;
        const response = await axios.get(`/api/v1/post/${postID}/comments?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const likeSinglePostComment = createAsyncThunk('singlePost/likeSinglePostComment', async(inputData: {postID: string, commentID: string}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/post/${inputData.postID}/comment/${inputData.commentID}/like`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unlikeSinglePostComment = createAsyncThunk('singlePost/unlikeSinglePostComment', async(inputData: {postID: string, commentID: string}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/post/${inputData.postID}/comment/${inputData.commentID}/unlike`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSinglePostComment = createAsyncThunk('singlePost/deleteSinglePostComment', async(inputData: {postID: string, commentID: string}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/post/${inputData.postID}/comment/${inputData.commentID}`);
        const data = response.data;
        thunkAPI.dispatch(getSinglePostComments(inputData.postID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSinglePostComment = createAsyncThunk('singlePost/editSinglePostComment', async(inputData: {postID: string, commentID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/post/${inputData.postID}/comment/${inputData.commentID}`, inputData.data);
        const data = response.data;
        return data.comment;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});