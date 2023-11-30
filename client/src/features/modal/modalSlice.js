import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    showModal: false,
    data: [],
    title: ''
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModalTrue: (state, action) => {
            state.showModal = true;
        },
        showModalFalse: (state, action) => {
            state.showModal = false;
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        resetModalData: (state, action) => {
            state.data = [];
        }
    },
    extraReducers: (builder) => {

    }
});

export const {showModalTrue, showModalFalse, setData, setTitle, resetModalData} = modalSlice.actions;

export default modalSlice.reducer;