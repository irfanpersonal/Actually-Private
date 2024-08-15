import {createSlice} from '@reduxjs/toolkit';
import {registerUser, loginUser, showCurrentUser, logoutUser, getUserBoxInformation, getDisoverPeopleInformation} from './userThunk';
import {toast} from 'react-toastify';

export type UserType = {
    userID: string,
    name: string,
    nickName: string,
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

export type User = {
    _id: string,
    name: string,
    nickName: string,
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

interface IUser {
    globalLoading: boolean,
    authLoading: boolean,
    logoutLoading: boolean,
    wantsToRegister: boolean,
    user: UserType | null,
    getUserBoxInformationLoading: boolean,
    userBoxInformation: User | null,
    getDisoverPeopleInformationLoading: boolean,
    discoverPeopleInformation: User[]
}

const initialState: IUser = {
    globalLoading: true,
    authLoading: false,
    logoutLoading: false,
    wantsToRegister: true,
    user: null,
    getUserBoxInformationLoading: true,
    userBoxInformation: null,
    getDisoverPeopleInformationLoading: true,
    discoverPeopleInformation: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.authLoading = false; 
            toast.error(action.payload as string);
        }).addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.globalLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.globalLoading = false;
        }).addCase(logoutUser.pending, (state) => {
            state.logoutLoading = true;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.logoutLoading = false;
            state.user = null;
            toast.success('Successfully Logged Out!');
        }).addCase(logoutUser.rejected, (state) => {
            state.logoutLoading = false;
        }).addCase(getUserBoxInformation.pending, (state) => {
            state.getUserBoxInformationLoading = true;
        }).addCase(getUserBoxInformation.fulfilled, (state, action) => {
            state.getUserBoxInformationLoading = false;
            state.userBoxInformation = action.payload;
        }).addCase(getUserBoxInformation.rejected, (state, action) => {
            state.getUserBoxInformationLoading = false;
        }).addCase(getDisoverPeopleInformation.pending, (state) => {
            state.getDisoverPeopleInformationLoading = true;
        }).addCase(getDisoverPeopleInformation.fulfilled, (state, action) => {
            state.getDisoverPeopleInformationLoading = false;
            state.discoverPeopleInformation = action.payload;
        }).addCase(getDisoverPeopleInformation.rejected, (state) => {
            state.getDisoverPeopleInformationLoading = false;
        });
    }
});

export const {toggleAuthType} = userSlice.actions;

export default userSlice.reducer;