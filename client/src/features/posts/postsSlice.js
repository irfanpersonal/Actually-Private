import {createSlice} from "@reduxjs/toolkit";
import {getAllPosts, getCurrentUserPosts, getUserFeed, likePost, unlikePost} from "./postsThunk.js";
import {toast} from 'react-toastify';

const initialState = {
    isLoadingUserPosts: true,
    posts: [],
    isLoadingUserFeed: true,
    isLoadingAllPosts: true
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCurrentUserPosts.pending, (state, action) => {
            state.isLoadingUserPosts = true;
        }).addCase(getCurrentUserPosts.fulfilled, (state, action) => {
            state.isLoadingUserPosts = false;
            state.posts = action.payload;
        }).addCase(getCurrentUserPosts.rejected, (state, action) => {
            state.isLoadingUserPosts = false;
        }).addCase(likePost.fulfilled, (state, action) => { 
            state.posts = state.posts.map(post => {
                if (post._id === action.payload.postID) {
                  post.likes.push(action.payload.userID);
                }
                return post;
            });
            toast.success('Liked Post!');
        }).addCase(unlikePost.fulfilled, (state, action) => {
            state.posts = state.posts.map(post => {
                if (post._id === action.payload.postID) {
                    post.likes = post.likes.filter(userId => userId !== action.payload.userID);
                }
                return post;
            });
            toast.success('Unliked Post!');
        }).addCase(getUserFeed.pending, (state, action) => {
            state.isLoadingUserFeed = true;
        }).addCase(getUserFeed.fulfilled, (state, action) => {
            state.isLoadingUserFeed = false;
            state.posts = action.payload;
        }).addCase(getUserFeed.rejected, (state, action) => {
            state.isLoadingUserFeed = false;
        }).addCase(getAllPosts.pending, (state, action) => {
            state.isLoadingAllPosts = true;
        }).addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoadingAllPosts = false;
            state.posts = action.payload;
        }).addCase(getAllPosts.rejected, (state, action) => {
            state.isLoadingAllPosts = false;
        })
    }
});

export const {setPosts} = postsSlice.actions;

export default postsSlice.reducer;