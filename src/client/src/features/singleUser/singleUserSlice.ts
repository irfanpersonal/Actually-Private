import {createSlice} from '@reduxjs/toolkit';
import {type UserType, type PostType} from '../profile/profileSlice';
import {getSingleUser, getSingleUserPosts, followUser, unfollowUser, createFollowRequest, deleteFollowRequest, blockUser, unblockUser} from './singleUserThunk';
import {toast} from 'react-toastify';
import {likePost, unlikePost} from '../post/postThunk';

interface ISingleUser {
    singleUserLoading: boolean,
    getSingleUserPostsLoading: boolean,
    followUserLoading: boolean,
    unfollowUserLoading: boolean,
    createFollowRequestLoading: boolean,
    deleteFollowRequestLoading: boolean,
    blockUserLoading: boolean,
    unblockUserLoading: boolean,
    singleUser: UserType | null,
    singleUserPosts: PostType[],
    totalPosts: number | null,
    numberOfPages: number | null,
    page: number,
    msg: string,
    isFollowing: boolean | null,
    sentFollowRequest: boolean | null,
    isBlockedByYou: boolean | null,
    canViewPosts: boolean | null,
    didUserBlockMe: boolean | null
}

const initialState: ISingleUser = {
    singleUserLoading: true,
    getSingleUserPostsLoading: true,
    followUserLoading: false,
    unfollowUserLoading: false,
    createFollowRequestLoading: false,
    deleteFollowRequestLoading: false,
    blockUserLoading: false,
    unblockUserLoading: false,
    singleUser: null,
    singleUserPosts: [],
    totalPosts: null,
    numberOfPages: null,
    page: 1,
    msg: '',
    isFollowing: null,
    sentFollowRequest: null,
    isBlockedByYou: null,
    canViewPosts: null,
    didUserBlockMe: null
};

const singleUserSlice = createSlice({
    name: 'singleUser',
    initialState,
    reducers: {
        resetPage: (state) => {
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSingleUser.pending, (state) => {
            state.singleUserLoading = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.singleUserLoading = false;
            state.singleUser = action.payload.user;
            state.msg = action.payload.msg;
            state.isFollowing = action.payload.isFollowing;
            state.sentFollowRequest = action.payload.sentFollowRequest;
            state.isBlockedByYou = action.payload.isBlockedByYou;
            state.canViewPosts = action.payload.canViewPosts;
            state.didUserBlockMe = action.payload.didUserBlockMe;
        }).addCase(getSingleUser.rejected, (state) => {
            state.singleUserLoading = true;
        }).addCase(getSingleUserPosts.pending, (state) => {
            state.getSingleUserPostsLoading = true;
        }).addCase(getSingleUserPosts.fulfilled, (state, action) => {
            state.getSingleUserPostsLoading = false;
            state.singleUserPosts = action.payload.posts;
            state.totalPosts = action.payload.totalPosts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getSingleUserPosts.rejected, (state, action) => {
            state.getSingleUserPostsLoading = true;
            state.canViewPosts = false;
            state.msg = action.payload as string;
        }).addCase(followUser.pending, (state) => {
            state.followUserLoading = true;
        }).addCase(followUser.fulfilled, (state) => {
            state.followUserLoading = false;
            state.isFollowing = true;
            state.singleUser!.followers.push('some value');
        }).addCase(followUser.rejected, (state, action) => {
            state.followUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(unfollowUser.pending, (state) => {
            state.unfollowUserLoading = true;
        }).addCase(unfollowUser.fulfilled, (state) => {
            state.unfollowUserLoading = false;
            state.isFollowing = false;
            state.singleUser!.followers.pop();
            if (state.singleUser!.visibility === 'private') {
                state.canViewPosts = false;
            }
        }).addCase(unfollowUser.rejected, (state, action) => {
            state.unfollowUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(createFollowRequest.pending, (state) => {
            state.createFollowRequestLoading = true;
        }).addCase(createFollowRequest.fulfilled, (state) => {
            state.createFollowRequestLoading = false;
            state.sentFollowRequest = true;
        }).addCase(createFollowRequest.rejected, (state, action) => {
            state.createFollowRequestLoading = false;
            toast.error(action.payload as string);
        }).addCase(deleteFollowRequest.pending, (state) => {
            state.deleteFollowRequestLoading = true;
        }).addCase(deleteFollowRequest.fulfilled, (state, action) => {
            state.deleteFollowRequestLoading = false;
            state.sentFollowRequest = false;
        }).addCase(deleteFollowRequest.rejected, (state, action) => {
            state.deleteFollowRequestLoading = false;
            toast.error(action.payload as string);
        }).addCase(blockUser.pending, (state) => {
            state.blockUserLoading = true;
        }).addCase(blockUser.fulfilled, (state, action) => {
            state.blockUserLoading = false;
            state.isBlockedByYou = true;
            state.isFollowing = false;
            state.singleUser!.followers.pop();
            state.canViewPosts = false;
        }).addCase(blockUser.rejected, (state) => {
            state.blockUserLoading = false;
        }).addCase(unblockUser.pending, (state) => {
            state.unblockUserLoading = true;
        }).addCase(unblockUser.fulfilled, (state, action) => {
            state.unblockUserLoading = false;
            state.isBlockedByYou = false;
            state.canViewPosts = true;
        }).addCase(unblockUser.rejected, (state) => {
            state.unblockUserLoading = false;
        }).addCase(likePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const likedPost = state.singleUserPosts.find(item => item._id === postID);
            if (likedPost) {
                likedPost!.liked = true;
                likedPost!.likes.push('NEW LIKE');
            }
        }).addCase(unlikePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const unlikedPost = state.singleUserPosts.find(item => item._id === postID);
            if (unlikedPost) {
                unlikedPost!.liked = false;
                unlikedPost!.likes.pop();
            }
        });
    }
});

export const {resetPage, setPage} = singleUserSlice.actions;

export default singleUserSlice.reducer;