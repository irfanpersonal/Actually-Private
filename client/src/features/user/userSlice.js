import {createSlice} from "@reduxjs/toolkit";
import {registerUser, loginUser, showCurrentUser, logoutUser, updateUser} from "./userThunk.js";
import {toast} from 'react-toastify';
import {getThemeFromLocalStorage} from '../../utils';
import {followUser, unfollowUser} from "../otherProfile/otherProfileThunk.js";

const initialState = {
    isLoading: true,
    user: null,
    wantsToRegister: true,
    profileEditing: false,
    theme: getThemeFromLocalStorage() || 'light'
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleWantsToRegister: (state, action) => {
            state.wantsToRegister = !state.wantsToRegister;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    },  
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(loginUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(showCurrentUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.user = null;
            toast.success('Successfully Logged Out!');
        }).addCase(updateUser.pending, (state, action) => {
            state.profileEditing = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.profileEditing = false;
            state.user.followers = action.payload.followers;
            state.user.following = action.payload.following;
            state.user.bio = action.payload.bio;
            state.user.location = action.payload.location;
            state.user.profilePicture = action.payload.profilePicture;
            toast.success('Edited Profile!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.profileEditing = false;
            toast.error(action.payload);
        })
    }
});

export const {toggleWantsToRegister, setTheme} = userSlice.actions;

export default userSlice.reducer;