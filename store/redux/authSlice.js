import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    isAuthenticated: false,
    user_uid: "",
    first_time_login: true,
    user_type: null,
    //patient data below:
    age: null,
    compliance_status: null,
    data_of_diagnosis: null,
    diagnosis: null,
    email: null,
    first_name: null,
    gender: null,
    last_name: null,
    nationality: null,
    notes: null,
    nric_passport: null,
    number_of_tablets: null,
    phone_number: null,
    profile_pic_url: null,
    treatment: null,
    treatment_duration_months: null,
    //healthcare data below:
    category: null,
    role: null,
    staff_id: null,
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user_uid = action.payload.user_uid;
    },
    setUserType: (state, action) => {
      state.user_type = action.payload.user_type;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user_uid = null;
    },
    setFirstTimeLogin: (state, action) => {
      state.first_time_login = action.payload.first_time_login;
    },
    fetchPatientData: (state, action) => {
      state.age = action.payload.age;
      state.compliance_status = action.payload.compliance_status;
      state.data_of_diagnosis = action.payload.data_of_diagnosis;
      state.diagnosis = action.payload.diagnosis;
      state.email = action.payload.email;
      state.first_name = action.payload.first_name;
      state.gender = action.payload.gender;
      state.last_name = action.payload.last_name;
      state.nationality = action.payload.nationality;
      state.notes = action.payload.notes;
      state.nric_passport = action.payload.nric_passport;
      state.number_of_tablets = action.payload.number_of_tablets;
      state.phone_number = action.payload.phone_number;
      state.profile_pic_url = action.payload.profile_pic_url;
      state.treatment = action.payload.treatment;
      state.treatment_duration_months =
        action.payload.treatment_duration_months;
    },
    fetchHealthcareData: (state, action) => {
        state.email = action.payload.email;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.profile_pic_url = action.payload.profile_pic_url;
        state.category = action.payload.category;
        state.role = action.payload.role;
        state.staff_id = action.payload.staff_id;
    }
  },
});

export const authenticateStoreNative = (storedToken, userId, userType) => {
  return async (dispatch) => {
    dispatch(authenticate({ token: storedToken, user_uid: userId }));
    dispatch(setUserType({ user_type: userType }));
    try {
      await SecureStore.setItemAsync("token", storedToken);
      await SecureStore.setItemAsync("uid", userId);
      await SecureStore.setItemAsync("user_type", userType);
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

export const setUserType = authSlice.actions.setUserType;
export const fetchHealthcareData = authSlice.actions.fetchHealthcareData;
export const fetchPatientData = authSlice.actions.fetchPatientData;
export const setFirstTimeLogin = authSlice.actions.setFirstTimeLogin;
export const authenticate = authSlice.actions.authenticate;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;