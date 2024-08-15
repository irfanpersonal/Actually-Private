import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {deleteSinglePost, getSinglePost} from '../singlePost/singlePostThunk';
import {createPost} from '../post/postThunk';
import {getSingleUser} from '../singleUser/singleUserThunk';

interface INavigate {
    location: string
}

const initialState: INavigate = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(deleteSinglePost.fulfilled, (state) => {
            state.location = state.location === `/profile` ? `/profile#` : `/profile`;
        }).addCase(createPost.fulfilled, (state, action) => {
            // state.location = state.location === `/post/${action.payload.post._id}` ? `/post/${action.payload.post._id}#` : `/post/${action.payload.post._id}`;
        }).addCase(getSingleUser.rejected, (state) => {
            state.location = state.location === `/` ? `/#` : `/`;
        }).addCase(getSinglePost.rejected, (state) => {
            state.location = state.location === `/` ? `/#` : `/`;
        });
    }
});

export const {} = navigationSlice.actions;

export default navigationSlice.reducer;