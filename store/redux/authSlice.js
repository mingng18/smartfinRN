import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isAuthenticated: false,
        user_uid: "",
    },
    reducers: {
        authenticate: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.user_uid = action.payload.uid;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const authenticateStoreNative = (storedToken, userId) => {
    return async (dispatch) => {
        dispatch(authenticate({ token: storedToken , uid: userId}));
        try {
            await SecureStore.setItemAsync("token", storedToken);
            await SecureStore.setItemAsync("uid", userId)
        } catch (error) {
            console.log("error occured when storing token into secureStore");
        }
        
    };
};

export const logoutDeleteNative = () => {
    return async (dispatch) => {
        dispatch(logout());
        try {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("uid");
        } catch (error) {
            console.log("error occured when deleting token in secureStore");
        }
        
    };
};


export const authenticate = authSlice.actions.authenticate;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;
