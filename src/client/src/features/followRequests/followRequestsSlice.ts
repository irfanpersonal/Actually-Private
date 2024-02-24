import {createSlice} from '@reduxjs/toolkit';
import {viewAllFollowRequests, updateFollowRequest} from './followRequestsThunk';
import {type UserType} from '../profile/profileSlice';
import {toast} from 'react-toastify';

export type FollowRequestType = {
    _id: string,
    from: UserType,
    to: UserType,
    createdAt: string,
    updatedAt: string
};

interface IFollowRequests {
    viewAllFollowRequestsLoading: boolean,
    updateFollowRequestLoading: boolean,
    followRequests: FollowRequestType[],
    page: number
    totalFollowRequests: number | null,
    numberOfPages: number | null,
}

const initialState: IFollowRequests = {
    viewAllFollowRequestsLoading: true,
    updateFollowRequestLoading: false,
    followRequests: [],
    page: 1,
    totalFollowRequests: null,
    numberOfPages: null
};

const followRequestSlice = createSlice({
    name: 'followRequests',
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
        builder.addCase(viewAllFollowRequests.pending, (state) => {
            state.viewAllFollowRequestsLoading = true;
        }).addCase(viewAllFollowRequests.fulfilled, (state, action) => {
            state.viewAllFollowRequestsLoading = false;
            state.followRequests = action.payload.followRequests;
            state.totalFollowRequests = action.payload.totalFollowRequests;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(viewAllFollowRequests.rejected, (state) => {
            state.viewAllFollowRequestsLoading = false;
        }).addCase(updateFollowRequest.pending, (state) => {
            state.updateFollowRequestLoading = true;
        }).addCase(updateFollowRequest.fulfilled, (state, action) => {
            state.updateFollowRequestLoading = false;
        }).addCase(updateFollowRequest.rejected, (state, action) => {
            state.updateFollowRequestLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {resetPage, setPage} = followRequestSlice.actions;

export default followRequestSlice.reducer;