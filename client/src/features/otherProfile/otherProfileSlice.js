import {createSlice} from "@reduxjs/toolkit";
import {followUser, unfollowUser} from "./otherProfileThunk";
import {toast} from 'react-toastify';
import {likePost, unlikePost} from "../posts/postsThunk";

const initialState = {
    profileData: null,
    profilePosts: []
};

const otherProfileSlice = createSlice({
    name: 'otherProfile',
    initialState,
    reducers: {
        setProfileData: (state, action) => {
            state.profileData = action.payload;
        },
        setProfilePosts: (state, action) => {
            state.profilePosts = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(followUser.fulfilled, (state, action) => {
            state.profileData.followers.push({...action.payload.user, _id: action.payload.user.userID});
            toast.success('Followed User!');
        }).addCase(unfollowUser.fulfilled, (state, action) => {
            state.profileData.followers = state.profileData.followers.filter((followerId) => followerId._id !== action.payload.user.userID);
            toast.success('Unfollowed User!');
        }).addCase(likePost.fulfilled, (state, action) => { 
            state.profilePosts = state.profilePosts.map(post => {
                if (post._id === action.payload.postID) {
                  post.likes.push(action.payload.userID);
                }
                return post;
            });
        }).addCase(unlikePost.fulfilled, (state, action) => {
            state.profilePosts = state.profilePosts.map(post => {
                if (post._id === action.payload.postID) {
                    post.likes = post.likes.filter(userId => userId !== action.payload.userID);
                }
                return post;
            });
        });
    }
});

export const {setProfileData, setProfilePosts} = otherProfileSlice.actions;

export default otherProfileSlice.reducer;