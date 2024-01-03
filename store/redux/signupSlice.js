import { createSlice } from "@reduxjs/toolkit";
import { fetchPatientData } from "./authSlice";

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
    staffId: "",
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
      state.staffId = action.payload.staffId;
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
  },
});

export const updateAuthSlice = () => {
return async (dispatch) => {
    dispatch(setUserType({ user_type: state.signupMode }));
    if (signupMode === "patient") {
        dispatch(
            fetchPatientData({
                age: state.age,
                compliance_status: state.compliance_status,
                data_of_diagnosis: state.data_of_diagnosis,
                diagnosis: state.diagnosis,
                email: state.email,
                first_name: state.first_name,
                gender: state.gender,
                last_name: state.last_name,
                nationality: state.nationality,
                notes: state.notes,
                nric_passport: state.nric_passport,
                number_of_tablets: state.number_of_tablets,
                phone_number: state.phone_number,
                profile_pic_url: state.profile_pic_url,
                treatment: state.treatment,
                treatment_duration_months: state.treatment_duration_months,
            })
        );
    }
    else {
        dispatch(
            fetchHealthcareData({
                email: state.email,
                first_name: state.first_name,
                last_name: state.last_name,
                profile_pic_url: state.profile_pic_url,
                category: state.category,
                role: state.role,
                staff_id: state.staff_id,
            })
        );
    }
    try {
        await SecureStore.setItemAsync("token", storedToken);
        await SecureStore.setItemAsync("uid", userId);
        await SecureStore.setItemAsync("user_type", userType);
    } catch (error) {
        console.log("error occured when storing token into secureStore");
    }
};
};

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

export default signupSlice.reducer;
