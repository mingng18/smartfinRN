import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import errorStateReducer from './application_state/errorStateSlice';
import pendingStateReducer from './application_state/pendingStateSlice';
import signupReducer from './signupSlice';

export const store = configureStore({
    reducer: {
        authObject : authReducer,
        errorStateObject : errorStateReducer,
        pendingStateObject : pendingStateReducer,
        signupObject : signupReducer,
    }
});

