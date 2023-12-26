import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isAuthenticated: false,
    },
    reducers: {
        authenticate: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const authenticateStoreNative = (storedToken) => {
    return async (dispatch) => {
        dispatch(authenticate({ token: storedToken }));
        try {
            await SecureStore.setItemAsync("token", storedToken);
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
        } catch (error) {
            console.log("error occured when deleting token in secureStore");
        }
        
    };
};



// export function authenticateStoreNative(storedToken){
//     console.log(state.token + ": this is the token now");
//     return async function authenticateStoreNativeThunk(dispatch, getState) {
//         dispatch(authenticate({token : storedToken}))
//         await SecureStore.setItemAsync("token", state.token);
//         console.log(state.token + ": this is the token after");
//       // const response = await client.get('/fakeApi/todos')
      
//       // dispatch({ type: 'todos/todosLoaded', payload: response.todos })
//     }
// }


// export async function logoutDeleteNative(dispatch, getState) {
    
//   // const response = await client.get('/fakeApi/todos')
//   dispatch(logout({}))
//   await SecureStore.deleteItemAsync("token");
//   // dispatch({ type: 'todos/todosLoaded', payload: response.todos })
// }


export const authenticate = authSlice.actions.authenticate;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;
