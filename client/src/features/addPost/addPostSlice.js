import {createSlice} from "@reduxjs/toolkit";
import {createPost, getSinglePost, editSinglePost, deleteSinglePost} from "./addPostThunk";
import {toast} from 'react-toastify';

const initialState = {
    isEditing: false,
    isLoading: false,
    singlePostData: {
        content: ''
    },
    isLoadingSinglePost: false
};

const addPostSlice = createSlice({
    name: 'addPost',
    initialState,
    reducers: {
        isEditingTrue: (state, action) => {
            state.isEditing = true;
        },
        isEditingFalse: (state, action) => {
            state.isEditing = false;
        },
        updateSinglePostData: (state, action) => {
            state.singlePostData[action.payload.name] = action.payload.value;
        },
        resetSinglePostData: (state, action) => {
            state.singlePostData = {
                content: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createPost.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Created Post!');
        }).addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(getSinglePost.pending, (state, action) => {
            state.isLoadingSinglePost = true;
        }).addCase(getSinglePost.fulfilled, (state, action) => {
            state.isLoadingSinglePost = false;
            state.singlePostData = action.payload;
        }).addCase(getSinglePost.rejected, (state, action) => {
            state.isLoadingSinglePost = false;
        }).addCase(editSinglePost.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(editSinglePost.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Edited Post!');
        }).addCase(editSinglePost.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(deleteSinglePost.fulfilled, (state, action) => {
            toast.success('Deleted Post');
        }).addCase(deleteSinglePost.rejected, (state, action) => {
            toast.error('Failed to Delete Post!');
        })
    }
});

export const {isEditingTrue, isEditingFalse, updateSinglePostData, resetSinglePostData} = addPostSlice.actions;

export default addPostSlice.reducer;