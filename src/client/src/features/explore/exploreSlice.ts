import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../profile/profileSlice';
import {getTrendingTopics, getAllUsers} from './exploreThunk';

interface IExplore {
    getTrendingTopicsLoading: boolean,
    getAllUsersLoading: boolean,
    trendingTopics: string[],
    search: string,
    users: UserType[],
    totalUsers: number | null,
    numberOfPages: number | null,
    page: number
}

const initialState: IExplore = {
    getTrendingTopicsLoading: true,
    getAllUsersLoading: false,
    trendingTopics: [],
    search: '',
    users: [],
    totalUsers: null,
    numberOfPages: null,
    page: 1
};

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        setSearchForExplore: (state, action) => {
            state.search = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        resetAllUsersData: (state) => {
            state.search = '';
            state.users = [];
            state.totalUsers = null;
            state.numberOfPages = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTrendingTopics.pending, (state) => {
            state.getTrendingTopicsLoading = true;
        }).addCase(getTrendingTopics.fulfilled, (state, action) => {
            state.getTrendingTopicsLoading = false;
            state.trendingTopics = action.payload;
        }).addCase(getTrendingTopics.rejected, (state) => {
            state.getTrendingTopicsLoading = false;
        }).addCase(getAllUsers.pending, (state) => {
            state.getAllUsersLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.getAllUsersLoading = false;
            state.users = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllUsers.rejected, (state) => {
            state.getAllUsersLoading = false;
        });
    }
});

export const {setSearchForExplore, setPage, resetAllUsersData} = exploreSlice.actions;

export default exploreSlice.reducer;