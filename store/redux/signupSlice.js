import { createSlice } from "@reduxjs/toolkit";
import { fetchPatientData, setUserType } from "./authSlice";

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    nationality: "",
    nric_passport: "",
    uid: "",
    email: "",
    dateOfDiagnosis: null,
    diagnosis: "",
    durationOfTreatment: 0,
    currentTreatment: null,
    numberOfTablets: 0,
    password: "",
    profilePictureURI: null,
    age: 0,
    signupMode: "",
    mpmId: "",
    role: "",
    category: "",
  },
  reducers: {
    updateSignupMode: (state, action) => {
      state.signupMode = action.payload.signupMode;
    },
    updateSignInCredentials: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    updatePersonalInformation: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.gender = action.payload.gender;
      state.phoneNumber = action.payload.phoneNumber;
      state.nationality = action.payload.nationality;
      state.nric_passport = action.payload.nric_passport;
      state.age = action.payload.age;
    },
    updateHealthcareInformation: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.mpmId = action.payload.mpmId;
      state.role = action.payload.role;
      state.category = action.payload.category;
    },
    updateProfilePictureURI: (state, action) => {
      state.profilePictureURI = action.payload.profilePictureURI;
    },
    updateMedicalInformation: (state, action) => {
      state.dateOfDiagnosis = action.payload.dateOfDiagnosis;
      state.diagnosis = action.payload.diagnosis;
      state.durationOfTreatment = action.payload.durationOfTreatment;
      state.currentTreatment = action.payload.currentTreatment;
      state.numberOfTablets = action.payload.numberOfTablets;
    },
    clearSignupSlice: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.gender = "";
      state.phoneNumber = "";
      state.nationality = "";
      state.nric_passport = "";
      state.uid = "";
      state.email = "";
      state.dateOfDiagnosis = null;
      state.diagnosis = "";
      state.durationOfTreatment = 0;
      state.currentTreatment = null;
      state.numberOfTablets = 0;
      state.password = "";
      state.profilePictureURI = null;
      state.age = 0;
      state.signupMode = "";
      state.mpmId = "";
      state.role = "";
      state.category = "";
    }
  },
});

export const updateSignupMode = signupSlice.actions.updateSignupMode;
export const updateProfilePictureURI =
  signupSlice.actions.updateProfilePictureURI;
export const updateSignInCredentials =
  signupSlice.actions.updateSignInCredentials;
export const updatePersonalInformation =
  signupSlice.actions.updatePersonalInformation;
export const updateHealthcareInformation =
  signupSlice.actions.updateHealthcareInformation;
export const updateMedicalInformation =
  signupSlice.actions.updateMedicalInformation;
export const clearSignupSlice = signupSlice.actions.clearSignupSlice;

export default signupSlice.reducer;
