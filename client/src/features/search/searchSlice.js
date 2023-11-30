import {createSlice} from "@reduxjs/toolkit";
import {searchUsers} from "./searchThunk";

const initialState = {
    search: '',
    totalUsers: null,
    numberOfPages: null,
    page: 1,
    users: [],
    isLoading: false
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateSearch: (state, action) => {
            state.search = action.payload;
        },
        updatePage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchUsers.pending, (state, action) => {
            state.page = 1;
            state.isLoading = true;
        }).addCase(searchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(searchUsers.rejected, (state, action) => {
            state.isLoading = false;
        })
    }
});

export const {updateSearch, updatePage} = searchSlice.actions;

export default searchSlice.reducer;