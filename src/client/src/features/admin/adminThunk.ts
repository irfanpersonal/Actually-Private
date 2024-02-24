import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getStats = createAsyncThunk('admin/getStats', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/admin/stats');
        const data = response.data;
        return data.statsData;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});