import {createSlice} from '@reduxjs/toolkit';
import {getStats} from './adminThunk';

interface IAdmin {
    getStatsLoading: boolean,
    statsData: any
}

const initialState: IAdmin = {
    getStatsLoading: true,
    statsData: null
};  

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getStats.pending, (state) => {
            state.getStatsLoading = true;
        }).addCase(getStats.fulfilled, (state, action) => {
            state.getStatsLoading = false;
            state.statsData = action.payload;
        }).addCase(getStats.rejected, (state, action) => {
            state.getStatsLoading = false;
        });
    }
});

export const {} = adminSlice.actions;

export default adminSlice.reducer;