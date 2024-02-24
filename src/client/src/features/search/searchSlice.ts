import {createSlice} from '@reduxjs/toolkit';
import {type PostType, type UserType} from '../profile/profileSlice';
import {getGlobalSearch, getSuggestedUsers} from './searchThunk';
import {likePost, unlikePost} from '../post/postThunk';

interface ISearch {
    globalSearchLoading: boolean, 
    posts: PostType[],
    totalPosts: number | null,
    numberOfPages: number | null,
    page: number,
    search: string,
    getSuggestedUsersLoading: boolean,
    suggestedUsers: UserType[]
}

const initialState: ISearch = {
    globalSearchLoading: true,
    posts: [],
    totalPosts: null,
    numberOfPages: null,
    page: 1,
    search: '',
    getSuggestedUsersLoading: true,
    suggestedUsers: []
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGlobalSearch.pending, (state) => {
            state.globalSearchLoading = true;
        }).addCase(getGlobalSearch.fulfilled, (state, action) => {
            state.globalSearchLoading = false;
            state.posts = action.payload.posts;
            state.totalPosts = action.payload.totalPosts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getGlobalSearch.rejected, (state) => {
            state.globalSearchLoading = false;
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
        }).addCase(getSuggestedUsers.pending, (state) => {
            state.getSuggestedUsersLoading = true;
        }).addCase(getSuggestedUsers.fulfilled, (state, action) => {
            state.getSuggestedUsersLoading = false;
            state.suggestedUsers = action.payload.users;
        }).addCase(getSuggestedUsers.rejected, (state) => {
            state.getSuggestedUsersLoading = false;
        });
    }
});

export const {setPage, setSearch} = searchSlice.actions;

export default searchSlice.reducer;