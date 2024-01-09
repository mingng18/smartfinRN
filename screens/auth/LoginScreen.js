import React, { useState } from "react";
import { Alert } from "react-native";
import LoginContentForm from "../../components/Auth/LoginContentForm";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { useDispatch } from "react-redux";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "../../store/redux/authSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fetchDocument } from "../../util/firestoreWR";
import { USER_TYPE } from "../../constants/constants";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();
  const dispatch = useDispatch();
  const auth = getAuth();

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdTokenResult();
      try {
        const isPatient = await fetchDocument("patient", user.uid);
        dispatch(authenticateStoreNative(token.token, user.uid, "patient"));
        dispatch(
          fetchPatientData({
            ...isPatient,
            date_of_diagnosis: isPatient.date_of_diagnosis
              .toDate()
              .toISOString(),
          })
        );
        dispatch(
          fetchAppointments({
            userId: user.uid,
            userType: USER_TYPE.PATIENT,
          })
        );
        dispatch(
          fetchSideEffects({ userId: user.uid, userType: USER_TYPE.PATIENT })
        );
        dispatch(
          fetchVideos({ userId: user.uid, userType: USER_TYPE.PATIENT })
        );
      } catch (error) {
        const isHealthcare = await fetchDocument("healthcare", user.uid);
        dispatch(authenticateStoreNative(token.token, user.uid, "healthcare"));
        dispatch(fetchHealthcareData({ ...isHealthcare }));
        dispatch(fetchPatientCollectionData());
        dispatch(
          fetchAppointments({
            userId: user.uid,
            userType: USER_TYPE.HEALTHCARE,
          })
        );
        dispatch(
          fetchSideEffects({
            userId: user.uid,
            userType: USER_TYPE.HEALTHCARE,
          })
        );
        dispatch(
          fetchVideos({ userId: user.uid, userType: USER_TYPE.HEALTHCARE })
        );
      }
    } catch (error) {
      Alert.alert(
        "Authentication failed! Please check your credentials or sign up a new account!"
      );
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <LoginContentForm onAuthenticate={loginHandler} />;
}

export default LoginScreen;
