import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  Divider,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

import { sendPasswordResetEmail } from "../../util/firebaseAuth";
import {
  FIREBASE_COLLECTION,
  LOGO_NO_TYPE,
  USER_TYPE,
} from "../../constants/constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
  setFirstTimeLogin,
} from "../../store/redux/authSlice";
import { fetchDocument } from "../../util/firestoreWR";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { updateSignInCredentials } from "../../store/redux/signupSlice";

function LoginContentForm({ onAuthenticate }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation("auth");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visible, setVisible] = useState(false);
  const [enteredForgotEmail, setEnteredForgotEmail] = useState("");
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
  });

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  React.useEffect(() => {
    function onAuthStateChanged(user) {
      setUser(user);
      // console.log("user is : " + user);
      // console.log("user is : " + JSON.stringify(user));
      // const token = user.getIdTokenResult();
      // console.log("token is : " + idToken);
      // dispatch(authenticateStoreNative(idToken, user.uid, "patient"));
      if (initializing) setInitializing(false);
    }

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function googleSignIn() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      setToken(idToken);
      console.log("idToken is : " + idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log("googleCredential is : " + googleCredential);
      console.log("googleCredential is : " + JSON.stringify(googleCredential));
      // Sign-in the user with the credential
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.message.includes("Sign in action cancelled")) {
        console.log("Sign in with google cancelled");
      } else {
        Alert.alert(t("auth_fail"), t("auth_fail_message"));
        console.log("Error signing in with Google: " + error);
      }
    }
  }

  async function googleButtonPressHandler() {
    async function loginAndFetchUserFromDatabase(storedUid, storedToken, user) {
      try {
        const patientUser = await fetchDocument(
          FIREBASE_COLLECTION.PATIENT,
          storedUid
        );
        dispatch(authenticateStoreNative(storedToken, storedUid, "patient"));
        dispatch(
          fetchPatientData({
            ...patientUser,
            date_of_diagnosis: patientUser.date_of_diagnosis
              .toDate()
              .toISOString(),
            treatment_start_date: patientUser.treatment_start_date
              .toDate()
              .toISOString(),
            treatment_end_date: patientUser.treatment_end_date
              .toDate()
              .toISOString(),
          })
        );
        dispatch(
          fetchAppointments({
            userId: storedUid,
            userType: USER_TYPE.PATIENT,
          })
        );
        dispatch(
          fetchSideEffects({ userId: storedUid, userType: USER_TYPE.PATIENT })
        );
        dispatch(
          fetchVideos({ userId: storedUid, userType: USER_TYPE.PATIENT })
        );
      } catch (error) {
        try {
          const healthcareUser = await fetchDocument(
            FIREBASE_COLLECTION.HEALTHCARE,
            storedUid
          );

          dispatch(
            authenticateStoreNative(storedToken, storedUid, "healthcare")
          );
          dispatch(fetchHealthcareData({ ...healthcareUser }));
          dispatch(fetchPatientCollectionData());
          dispatch(
            fetchAppointments({
              userId: storedUid,
              userType: USER_TYPE.HEALTHCARE,
            })
          );
          dispatch(
            fetchVideos({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
          );
          dispatch(
            fetchSideEffects({
              userId: storedUid,
              userType: USER_TYPE.HEALTHCARE,
            })
          );
        } catch (error) {
          console.log("No user found in database, first time login user");
          dispatch(updateSignInCredentials({ email: user.email }));
          dispatch(setFirstTimeLogin({ first_time_login: true }));
          // Alert.alert(t("auth_fail"), t("auth_fail_message"));
        }
      }
    }

    userCredential = await googleSignIn();
    const user = userCredential.user;

    console.log("HAHAHAHAHA");
    console.log("user checking is : " + user.uid);

    //This function will first try to login as a patient, if not, then try to login as a healthcare
    //If not both, then the user is first time login
    loginAndFetchUserFromDatabase(user.uid, token, user);
  }

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  async function forgotPasswordHandler() {
    try {
      const email = await sendPasswordResetEmail(enteredForgotEmail);
      Alert.alert(
        "Password reset!",
        "A reset link has been sent to the email address.",
        [
          {
            text: "OK",
            onPress: () => {
              hideModal();
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      Alert.alert(
        "Something went wrong, please check your email entered is correct and try again."
      );
    }
  }

  function switchAuthModeHandler(mode) {
    navigation.navigate("SignInInfoScreen", { signupMode: mode });
  }

  function submitHandler() {
    email = enteredEmail.trim();
    password = enteredPassword.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailIsValid = emailRegex.test(email);
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
    const passwordIsValid = passwordRegex.test(password);

    setCredentialsInvalid({
      email: !emailIsValid,
      password: !passwordIsValid,
    });

    if (!emailIsValid || !passwordIsValid) {
      if (!emailIsValid && !passwordIsValid) {
        return Alert.alert(
          "Invalid email and password",
          "Please enter a valid email address and password."
        );
      } else if (!emailIsValid) {
        return Alert.alert(
          "Invalid email",
          "Please enter a valid email address."
        );
      } else if (!passwordIsValid) {
        return Alert.alert(
          "Invalid password",
          "Please enter a valid password. Your password must contain a combination of letters, numbers, and symbols, with at least 6 characters."
        );
      }
    }
    onAuthenticate({ email, password });
  }

  return (
    <>
      <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
        {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "100%" }}>
              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={hideModal}
                  contentContainerStyle={{
                    backgroundColor: theme.colors.background,
                    padding: 16,
                    paddingVertical: 40,
                    marginHorizontal: 16,
                    borderRadius: 16,
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={[
                      { color: theme.colors.onBackground, marginBottom: 16 },
                    ]}
                  >
                    {t("reset_password_text")}
                  </Text>
                  <TextInput
                    mode="outlined"
                    style={{ marginBottom: 40 }}
                    label={t("forgot_email_label")}
                    placeholder={t("forgot_email_placeholder")}
                    onChangeText={(email) => setEnteredForgotEmail(email)}
                    value={enteredForgotEmail}
                    keyboardType="email-address"
                  />
                  <View style={{ flexDirection: "row-reverse" }}>
                    <Button mode="contained" onPress={forgotPasswordHandler}>
                      {t("reset_password_btn")}
                    </Button>
                    <Button
                      mode="contained-tonal"
                      onPress={hideModal}
                      style={{ marginRight: 16 }}
                    >
                      {t("cancel")}
                    </Button>
                  </View>
                </Modal>
              </Portal>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={[styles.titleText, { color: theme.colors.onPrimary }]}
                  variant="headlineMedium"
                >
                  My TB Companion
                </Text>
                <Image
                  source={LOGO_NO_TYPE}
                  style={{ width: 150, height: 150 }}
                />
              </View>
              <View
                style={[
                  styles.authContent,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  style={{ marginVertical: 8, alignSelf: "center" }}
                  variant="titleLarge"
                >
                  {t("log_in")}
                </Text>
                <TextInput
                  mode="outlined"
                  style={{ height: 56 }}
                  label={t("email")}
                  placeholder={t("type_email")}
                  onChangeText={updateInputValueHandler.bind(this, "email")}
                  value={enteredEmail}
                  keyboardType="email-address"
                  error={credentialsInvalid.email}
                />
                <TextInput
                  mode="outlined"
                  style={{ height: 56, marginTop: 16 }}
                  label={t("password")}
                  placeholder={t("type_password")}
                  onChangeText={updateInputValueHandler.bind(this, "password")}
                  value={enteredPassword}
                  secureTextEntry={hidePassword}
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? "eye" : "eye-off"}
                      style={{ marginTop: 16 }}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                  error={credentialsInvalid.password}
                />
                <Button
                  key="forgotPassword"
                  mode="text"
                  compact
                  onPress={() => showModal()}
                  style={{
                    marginTop: 8,
                    width: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  {t("forgot_password")}
                </Button>
                <View style={{ flexGrow: 1 }} />
                <Button
                  mode="contained"
                  onPress={submitHandler}
                  style={{ height: 40 }}
                >
                  {t("log_in")}
                </Button>
                {/* TODO: To be Google Sign in */}
                <Button
                  mode="contained-tonal"
                  icon="google"
                  onPress={googleButtonPressHandler}
                  style={[
                    {
                      height: 40,
                      marginVertical: 16,
                      backgroundColor: theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  {t("google_sign_in")}
                </Button>
                <Divider style={{ height: 1 }} />
                <Text
                  variant="labelLarge"
                  style={{ alignSelf: "center", marginTop: 16 }}
                >
                  {t("sign_up")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  <Button
                    mode="contained-tonal"
                    onPress={() => switchAuthModeHandler("patient")}
                    style={[{ flex: 1, marginRight: 8 }]}
                  >
                    {t("patient")}
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={() => switchAuthModeHandler("healthcare")}
                    style={[{ flex: 1, marginLeft: 8 }]}
                  >
                    {t("healthcare")}
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: theme.colors.background }}
      />
    </>
  );
}

export default LoginContentForm;

const styles = StyleSheet.create({
  titleText: {
    marginHorizontal: 16,
    marginTop: 56,
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
  },
  titleText2: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    fontSize: 54,
  },
  authContent: {
    flexGrow: 1,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  buttons: {
    marginTop: 8,
  },
});
