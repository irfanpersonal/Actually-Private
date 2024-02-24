import {createSlice} from '@reduxjs/toolkit';
import {type PostType} from '../profile/profileSlice';
import {getUserFeed} from './userFeedThunk';
import {likePost, unlikePost} from '../post/postThunk';

interface IUserFeed {
    getUserFeedLoading: boolean,
    userFeed: PostType[],
    completedUserFeed: PostType[],
    totalPosts: number | null,
    numberOfPages: number | null,
    page: number
}

const initialState: IUserFeed = {
    getUserFeedLoading: true,
    userFeed: [],
    completedUserFeed: [],
    totalPosts: null,
    numberOfPages: null,
    page: 1
};

const userFeedSlice = createSlice({
    name: 'userFeed',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        resetEverything: (state) => {
            state.getUserFeedLoading = true;
            state.userFeed = [];
            state.completedUserFeed = [];
            state.totalPosts = null;
            state.numberOfPages = null;
            state.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserFeed.pending, (state) => {
            state.getUserFeedLoading = true;
        }).addCase(getUserFeed.fulfilled, (state, action) => {
            state.getUserFeedLoading = false;
            state.userFeed = [];
            state.userFeed = action.payload.posts;
            state.completedUserFeed = [...state.completedUserFeed, ...action.payload.posts];
            state.totalPosts = action.payload.totalPosts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getUserFeed.rejected, (state) => {
            state.getUserFeedLoading = false;
        }).addCase(likePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const likedPost = state.completedUserFeed.find(item => item._id === postID);
            if (likedPost) {
                likedPost!.liked = true;
            }
        }).addCase(unlikePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const unlikedPost = state.completedUserFeed.find(item => item._id === postID);
            if (unlikedPost) {
                unlikedPost!.liked = false;
            }
        });
    }
});

export const {setPage, resetEverything} = userFeedSlice.actions;

export default userFeedSlice.reducer;