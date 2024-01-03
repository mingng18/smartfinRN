import React, { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContentLogin from "../components/Auth/AuthContent_Login";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/firebaseAuth";
// import { AuthContext } from "../store/auth-context";
import { useDispatch } from "react-redux";
import {
  authenticateStoreNative,
  fetchHealthcareData,
} from "../store/redux/authSlice";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fetchDocument } from "../util/firestoreWR";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();
  const { navigate } = useNavigation();

  // const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const auth = getAuth();

  // React.useLayoutEffect(() => {
  //   navigate("HealthcareInformationScreen");
  // });

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
      const isPatient = await fetchDocument("patients", user.uid);
      if (isPatient != null) {
        dispatch(authenticateStoreNative(token.token, user.uid, "patient"));
        dispatch(
          fetchPatientData({
            age: isPatient.age,
            compliance_status: isPatient.compliance_status,
            data_of_diagnosis: isPatient.data_of_diagnosis,
            diagnosis: isPatient.diagnosis,
            email: isPatient.email,
            first_name: isPatient.first_name,
            last_name: isPatient.last_name,
            profile_picture: isPatient.profile_picture,
            uid: isPatient.uid,
          })
        );
      } else {
        const isHealthcare = await fetchDocument("healthcare", user.uid);
        dispatch(authenticateStoreNative(token.token, user.uid, "healthcare"));
        dispatch(
          fetchHealthcareData({
            email: isHealthcare.email,
            first_name: isHealthcare.first_name,
            last_name: isHealthcare.last_name,
            profile_picture: isHealthcare.profile_picture,
            category: isHealthcare.category,
            role: isHealthcare.role,
            staff_id: isHealthcare.staff_id,
          })
        );
      }
    } catch (error) {
      Alert.alert(
        "Authentication failed! Please check your credentials or sign up a new account!"
      );
      console.log(error); //Debug use
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContentLogin isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
