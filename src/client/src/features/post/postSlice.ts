import {createSlice} from '@reduxjs/toolkit';
import {createPost, likePost, unlikePost, createComment} from './postThunk';
import {toast} from 'react-toastify';

interface IPost {
    createPostLoading: boolean,
    creatingComment: boolean
}

const initialState: IPost = {
    createPostLoading: false,
    creatingComment: false
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(createPost.pending, (state) => {
            state.createPostLoading = true;
        }).addCase(createPost.fulfilled, (state, action) => {
            state.createPostLoading = false;
            toast.success('Created Post!');
        }).addCase(createPost.rejected, (state, action) => {
            state.createPostLoading = false;
            toast.error(action.payload as string);
        }).addCase(likePost.fulfilled, (state, action) => {
        }).addCase(likePost.rejected, (state, action) => {
            toast.error(action.payload as string);
        }).addCase(unlikePost.fulfilled, (state, action) => {
        }).addCase(unlikePost.rejected, (state, action) => {
            toast.error(action.payload as string);
        }).addCase(createComment.pending, (state) => {
            state.creatingComment = true;
        }).addCase(createComment.fulfilled, (state, action) => {
            state.creatingComment = false;
            toast.success('Created Comment!');
        }).addCase(createComment.rejected, (state, action) => {
            state.creatingComment = false;
            toast.error(action.payload as string);
        });
    }
});

export const {} = postSlice.actions;

export default postSlice.reducer;