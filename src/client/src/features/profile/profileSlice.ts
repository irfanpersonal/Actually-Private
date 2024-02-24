import {createSlice} from '@reduxjs/toolkit';
import {getProfileData, getProfilePosts, updateUser} from './profileThunk';
import {toast} from 'react-toastify';
import {likePost, unlikePost} from '../post/postThunk';
import {updateFollowRequest} from '../followRequests/followRequestsThunk';

export type PostType = {
    _id: string,
    location: string,
    image: string,
    content: string,
    user: UserType,
    liked: boolean,
    likes: string[],
    comments: string[]
};

export type UserType = {
    _id: string,
    name: string,
    email: string,
    profilePicture: string,
    location: string,
    bio: string,
    dateOfBirth: string,
    followers: string[],
    following: string[],
    visibility: 'public' | 'private',
    role: 'user' | 'admin'
};

interface IProfile {
    getProfileDataLoading: boolean,
    updateUserLoading: boolean,
    getProfilePostsLoading: boolean,
    posts: PostType[],
    page: number
    totalPosts: number | null,
    numberOfPages: number | null,
    profileData: UserType | null,
}

const initialState: IProfile = {
    getProfileDataLoading: true,
    updateUserLoading: false,
    getProfilePostsLoading: true,
    posts: [],
    page: 1,
    totalPosts: null,
    numberOfPages: null,
    profileData: null
};

const profileSlice = createSlice({
    name: 'profile',
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
        builder.addCase(getProfileData.pending, (state) => {
            state.getProfileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.getProfileDataLoading = false;
            state.profileData = action.payload;
        }).addCase(getProfileData.rejected, (state) => {
            state.getProfileDataLoading = false;
        }).addCase(getProfilePosts.pending, (state) => {
            state.getProfilePostsLoading = true;
        }).addCase(getProfilePosts.fulfilled, (state, action) => {
            state.getProfilePostsLoading = false;
            state.posts = action.payload.posts;
            state.totalPosts = action.payload.totalPosts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getProfilePosts.rejected, (state) => {
            state.getProfilePostsLoading = false;
        }).addCase(updateUser.pending, (state) => {
            state.updateUserLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.updateUserLoading = false;
            state.profileData = action.payload;
            toast.success('Updated User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.updateUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(likePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const likedPost = state.posts.find(item => item._id === postID);
            if (likedPost) {
                likedPost!.liked = true;
            }
        }).addCase(unlikePost.fulfilled, (state, action) => {
            const postID = action.meta.arg;
            const unlikedPost = state.posts.find(item => item._id === postID);
            if (unlikedPost) {
                unlikedPost!.liked = false;
            }
        }).addCase(updateFollowRequest.fulfilled, (state, action) => {
            if (action.meta.arg.accepted) {
                state.profileData!.followers.push('some value');
            }
        });
    }
});

export const {resetPage, setPage} = profileSlice.actions;

export default profileSlice.reducer;