import React, { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { FirebaseError } from "firebase/app";

import LoginContentForm from "../../components/Auth/LoginContentForm";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "../../store/redux/authSlice";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
  linkWithCredential,
} from "firebase/auth";
import { fetchDocument } from "../../util/firestoreWR";
import { USER_TYPE } from "../../constants/constants";
import { FIREBASE_COLLECTION } from "../../constants/constants";

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
      switch (error.code) {
        //General Error
        case "auth/account-exists-with-different-credential": //The account already exists with a different credential
          // Fetch a list of what sign-in methods exist for the conflicting user
          userSignInMethods = await fetchSignInMethodsForEmail(auth, email);

          // If the user has several sign-in methods,
          // the first method in the list will be the "recommended" method to use.
          if (userSignInMethods[0] === "password") {
            //Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
          } else if (userSignInMethods[0] === "google.com") {
            //Sign in with google
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = credential.user;
            //Link with email and password
            const credential = EmailAuthProvider.credential(email, password);
            await linkWithCredential(user, credential);
          } else {
            Alert.alert(
              "Authentication failed!",
              "We have found your account with a different sign in method. Please sign in with the correct sign in method."
            );
          }
          break;
        case "auth/user-not-found": //the user account was not found. This could happen if the user account has been deleted.
          Alert.alert("User not found", "Please kindly sign up a new account.");
          break;
        //Sign In Method Error (Email or Google)
        case "auth/invalid-email": //Indicates the email address is malformed.
          Alert.alert(
            "Invalid email address",
            "Please check your email address and try again."
          );
          break;
        case "auth/user-disabled": //	Indicates the user's account is disabled.
          Alert.alert(
            "Your account has been disabled.",
            "Please contact the administrator for more information."
          );
          break;
        case "auth/wrong-password": //	Indicates the user attempted sign in with a wrong password.
          Alert.alert(
            "Wrong password",
            "Please check your password and try again."
          );
          break;
        case "auth/invalid-credential": //Indicates the supplied credential is invalid. This could happen if it has expired or it is malformed.
          Alert.alert(
            "Invalid credential",
            "Your login might be expired or malformed. Please try again later."
          );
          break;

        default: //Other error
          console.log(error.code);
          Alert.alert(
            "Unknown error occured",
            "Please check your credentials and try again later"
          );
          break;
      }
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <LoginContentForm onAuthenticate={loginHandler} />;
}

export default LoginScreen;
