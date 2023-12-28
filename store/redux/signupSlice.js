import { createSlice } from '@reduxjs/toolkit';

const signupSlice = createSlice({
    name: 'signup',
    initialState: {
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        nationality: '',
        nric_passport: '',
        uid: '',
        email: '',
        dateOfDiagnosis: null,
        diagnosis: '',
        durationOfTreatment: null,
        currentTreatement: null,
        numberOfTablets: null,
        password: '',
        profilePictureURI: null,
        age: null,
    },
    reducers: {
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
    },
});

export const updateProfilePictureURI = signupSlice.actions.updateProfilePictureURI;
export const updateSignInCredentials = signupSlice.actions.updateSignInCredentials;
export const updatePersonalInformation = signupSlice.actions.updatePersonalInformation;
export const updateMedicalInformation = signupSlice.actions.updateMedicalInformation;

export default signupSlice.reducer;
    