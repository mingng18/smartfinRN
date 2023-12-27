import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    errorState: false,
    errorMessage: "",
};

const errorStateSlice = createSlice({
    name: 'errorState',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.errorState = action.payload.errorState;
            state.errorMessage = action.payload.errorMessage;
        },
        clearError: (state) => {
            state.errorState = null;
        },
    },
});

export const setError= errorStateSlice.actions.setError;
export const clearError= errorStateSlice.actions.clearError;

export default errorStateSlice.reducer;
