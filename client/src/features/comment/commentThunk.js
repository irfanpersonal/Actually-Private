import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const createComment = createAsyncThunk('comment/createComment', async({postID, comment}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/comments/create/${postID}`, {content: comment});
        const data = response.data;
        return data.comment;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const likeComment = createAsyncThunk('comment/likeComment', async(commentID, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/comments/likeComment/${commentID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const unlikeComment = createAsyncThunk('comment/unlikeComment', async(commentID, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/comments/unlikeComment/${commentID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createNestedComment = createAsyncThunk('comment/createNestedComment', async({postID, commentID, comment}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/comments/create/${postID}/${commentID}`, {content: comment});
        const data = response.data;
        return data.comment;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteComment = createAsyncThunk('comment/deleteComment', async(commentID, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/comments/${commentID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});