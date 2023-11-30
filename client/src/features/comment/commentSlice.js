import {createSlice} from "@reduxjs/toolkit";
import {createComment} from "./commentThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoading: false
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(createComment.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createComment.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Added Comment');
        }).addCase(createComment.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
    }
});

export const {} = commentSlice.actions;

export default commentSlice.reducer;