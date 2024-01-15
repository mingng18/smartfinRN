import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import errorStateReducer from "./application_state/errorStateSlice";
import pendingStateReducer from "./application_state/pendingStateSlice";
import signupReducer from "./signupSlice";
import appointmentReducer from "./appointmentSlice";
import sideEffectReducer from "./sideEffectSlice";
import videoReducer from "./videoSlice";
import patientDataReducer from "./patientDataSlice";
import bookedAppointmentDateReducer from "./bookedAppointmentDateSlice";

export const store = configureStore({
  reducer: {
    authObject: authReducer,
    errorStateObject: errorStateReducer,
    pendingStateObject: pendingStateReducer,
    signupObject: signupReducer,
    appointmentObject: appointmentReducer,
    sideEffectObject: sideEffectReducer,
    videoObject: videoReducer,
    patientDataObject: patientDataReducer,
    bookedAppointmentDateObject: bookedAppointmentDateReducer,
  },
});
