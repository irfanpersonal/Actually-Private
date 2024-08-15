import {createSlice} from '@reduxjs/toolkit';
import {createPost, likePost, unlikePost, createComment} from './postThunk';
import {toast} from 'react-toastify';
import {type PostType} from '../profile/profileSlice';

interface IPost {
    createPostLoading: boolean,
    creatingComment: boolean,
    createdPostArray: PostType[]
}

const initialState: IPost = {
    createPostLoading: false,
    creatingComment: false,
    createdPostArray: []
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
            state.createdPostArray.unshift(action.payload);
        }).addCase(createPost.rejected, (state, action) => {
            state.createPostLoading = false;
            toast.error(action.payload as string);
        }).addCase(likePost.fulfilled, (state, action) => {
            // Like the Post in the createdPostArray
            const postID = action.meta.arg;
            const likedPost = state.createdPostArray.find(item => item._id === postID);
            if (likedPost) {
                likedPost!.liked = true;
                likedPost!.likes.push('NEW LIKE');
            }
        }).addCase(likePost.rejected, (state, action) => {
            toast.error(action.payload as string);
        }).addCase(unlikePost.fulfilled, (state, action) => {
            // Dislike the Post in the createdPostArray
            const postID = action.meta.arg;
            const unlikedPost = state.createdPostArray.find(item => item._id === postID);
            if (unlikedPost) {
                unlikedPost!.liked = false;
                unlikedPost.likes.pop();
            }
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