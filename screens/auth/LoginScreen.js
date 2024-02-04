import React, { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { FirebaseError } from "firebase/app";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
// import {
//   fetchSignInMethodsForEmail,
//   getAuth,
//   signInWithEmailAndPassword,
//   linkWithCredential,
// } from "firebase/auth";

import LoginContentForm from "../../components/Auth/LoginContentForm";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "../../store/redux/authSlice";
import { fetchDocument } from "../../util/firestoreWR";
import { USER_TYPE } from "../../constants/constants";
import { FIREBASE_COLLECTION } from "../../constants/constants";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();
  const dispatch = useDispatch();
  const auth = getAuth();
  const { navigate } = useNavigation();
  const { t } = useTranslation("auth");

  React.useLayoutEffect(() => {
    // navigate("HealthcareInformationScreen");
  });
  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);

    // try {
    //   const userCredential = await signInWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   const user = userCredential.user;
    //   const token = await user.getIdTokenResult();
    //   try {
    //     const isPatient = await fetchDocument(
    //       FIREBASE_COLLECTION.PATIENT,
    //       user.uid
    //     );
    //     dispatch(authenticateStoreNative(token.token, user.uid, "patient"));
    //     dispatch(
    //       fetchPatientData({
    //         ...isPatient,
    //         date_of_diagnosis: isPatient.date_of_diagnosis
    //           .toDate()
    //           .toISOString(),
    //       })
    //     );
    //     dispatch(
    //       fetchAppointments({
    //         userId: user.uid,
    //         userType: USER_TYPE.PATIENT,
    //       })
    //     );
    //     dispatch(
    //       fetchSideEffects({ userId: user.uid, userType: USER_TYPE.PATIENT })
    //     );
    //     dispatch(
    //       fetchVideos({ userId: user.uid, userType: USER_TYPE.PATIENT })
    //     );
    //   } catch (error) {
    //     const isHealthcare = await fetchDocument(
    //       FIREBASE_COLLECTION.HEALTHCARE,
    //       user.uid
    //     );
    //     dispatch(authenticateStoreNative(token.token, user.uid, "healthcare"));
    //     dispatch(fetchHealthcareData({ ...isHealthcare }));
    //     dispatch(fetchPatientCollectionData());
    //     dispatch(
    //       fetchAppointments({
    //         userId: user.uid,
    //         userType: USER_TYPE.HEALTHCARE,
    //       })
    //     );
    //     dispatch(
    //       fetchSideEffects({
    //         userId: user.uid,
    //         userType: USER_TYPE.HEALTHCARE,
    //       })
    //     );
    //     dispatch(
    //       fetchVideos({ userId: user.uid, userType: USER_TYPE.HEALTHCARE })
    //     );
    //   }
    try {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (user) => {
          const token = await user.getIdToken();
          try {
            const isPatient = await fetchDocument(
              FIREBASE_COLLECTION.PATIENT,
              user.uid
            );
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
              fetchSideEffects({
                userId: user.uid,
                userType: USER_TYPE.PATIENT,
              })
            );
            dispatch(
              fetchVideos({ userId: user.uid, userType: USER_TYPE.PATIENT })
            );
          } catch (error) {
            const isHealthcare = await fetchDocument(
              FIREBASE_COLLECTION.HEALTHCARE,
              user.uid
            );
            dispatch(
              authenticateStoreNative(token.token, user.uid, "healthcare")
            );
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
        });
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
            Alert.alert(t("auth_fail"), t("diff_acc"));
          }
          break;
        case "auth/user-not-found": //the user account was not found. This could happen if the user account has been deleted.
          Alert.alert(t("user_not_found"), t("sign_up_new_acc"));
          break;
        //Sign In Method Error (Email or Google)
        case "auth/invalid-email": //Indicates the email address is malformed.
          Alert.alert(t("invalid_email"), t("invalid_email_message"));
          break;
        case "auth/user-disabled": //	Indicates the user's account is disabled.
          Alert.alert(t("user_disabled"), t("user_disabled_message"));
          break;
        case "auth/wrong-password": //	Indicates the user attempted sign in with a wrong password.
          Alert.alert(t("wrong_password"), t("wrong_password_message"));
          break;
        case "auth/invalid-credential": //Indicates the supplied credential is invalid. This could happen if it has expired or it is malformed.
          Alert.alert(t("invalid_credential"), t("invalid_credential_message"));
          break;
        default: //Other error
          console.log(error.code);
          Alert.alert(t("unknown_error"), t("unknown_error_message"));
          break;
      }
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={t("logging_in")} />;
  }

  return <LoginContentForm onAuthenticate={loginHandler} />;
}

export default LoginScreen;
