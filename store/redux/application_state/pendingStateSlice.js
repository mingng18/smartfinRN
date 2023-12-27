import { createSlice } from '@reduxjs/toolkit';

const pendingStateSlice = createSlice({
    name: 'pendingState',
    initialState: {
        isPending: false,
    },
    reducers: {
        setInPendingState: (state) => {
            state.isPending = true;
        },
        removePendingState: (state) => {
            state.isPending = false;
        },
    },
});

export const setInPendingState = pendingStateSlice.actions.setInPendingState;
export const removePendingState = pendingStateSlice.actions.removePendingState;
export default pendingStateSlice.reducer;
