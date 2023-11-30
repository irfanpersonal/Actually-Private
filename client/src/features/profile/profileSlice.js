import {createSlice} from "@reduxjs/toolkit";
import {getUserProfileData} from "./profileThunk";
import {updateUser} from "../user/userThunk";

const initialState = {
    isLoadingUserData: true,
    isLoadingUserPosts: true,
    isEditing: false,
    posts: [],
    user: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        isEditingTrue: (state, action) => {
            state.isEditing = true;
        },
        isEditingFalse: (state, action) => {
            state.isEditing = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfileData.pending, (state, action) => {
            state.isLoadingUserData = true;
        }).addCase(getUserProfileData.fulfilled, (state, action) => {
            state.isLoadingUserData = false;
            state.user = action.payload;
        }).addCase(getUserProfileData.rejected, (state, action) => {
            state.isLoadingUserData = false;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.user.followers = action.payload.followers;
            state.user.following = action.payload.following;
            state.user.bio = action.payload.bio;
            state.user.location = action.payload.location;
            state.user.profilePicture = action.payload.profilePicture;
        })
    }
});

export const {isEditingTrue, isEditingFalse} = profileSlice.actions;

export default profileSlice.reducer;