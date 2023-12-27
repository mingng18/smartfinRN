import { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
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

import AuthForm from "./AuthForm";
import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "../../util/firebaseAuth";

function AuthContentLogin({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const theme = useTheme();

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
      Alert.alert("Password reset!");
    } catch (error) {
      Alert.alert(
        "Something went wrong, please check your email entered is correct and try again."
      );
    }
  }

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.navigate("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {

    email = enteredEmail.trim();
    password = enteredPassword.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (
      !emailIsValid ||
      !passwordIsValid
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
        {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "100%" }}>
              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={hideModal}
                  contentContainerStyle={{
                    backgroundColor: "white",
                    padding: 20,
                  }}
                >
                  <Text
                    style={[
                      styles.titleText,
                      { color: theme.colors.onPrimary },
                    ]}
                  >
                    Please enter your email to reset password
                  </Text>
                  <TextInput
                    mode="outlined"
                    style={{ height: 56 }}
                    label="Forgot Email Address"
                    placeholder="Type your email"
                    onChangeText={(email) => setEnteredForgotEmail(email)}
                    value={enteredForgotEmail}
                    keyboardType="email-address"
                    // isInvalid={emailIsInvalid}
                  />
                  <Button
                    mode="contained"
                    onPress={forgotPasswordHandler}
                    style={{ height: 40 }}
                  >
                    {"Reset Password"}
                  </Button>
                </Modal>
              </Portal>
              <View style={[styles.header]}>
                <Text
                  style={[styles.titleText, { color: theme.colors.onPrimary }]}
                  variant="headlineLarge"
                >
                  Welcome to
                </Text>

                <Text
                  style={[styles.titleText2, { color: theme.colors.onPrimary }]}
                  variant="displayLarge"
                >
                  My TB Companion
                </Text>
              </View>
              <View
                style={[
                  styles.authContent,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <View style={{ marginBottom: 16 }}>
                  <TextInput
                    mode="outlined"
                    style={{ height: 56 }}
                    label="Email Address"
                    placeholder="Type your email"
                    onChangeText={updateInputValueHandler.bind(this, "email")}
                    value={enteredEmail}
                    keyboardType="email-address"
                    error={credentialsInvalid.email}
                  />
                  <TextInput
                    mode="outlined"
                    style={{ height: 56, marginTop: 16 }}
                    label="Password"
                    placeholder="Type your password"
                    onChangeText={updateInputValueHandler.bind(
                      this,
                      "password"
                    )}
                    value={enteredPassword}
                    secureTextEntry
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
                    {isLogin ? "Forgot Password?" : ""}
                  </Button>
                  <View style={{ flexGrow: 1 }} />
                  <Button
                    mode="contained"
                    onPress={submitHandler}
                    style={{ height: 40 }}
                  >
                    Log In
                  </Button>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 16,
                    width: "100%",
                  }}
                >
                  <Button
                    mode="contained-tonal"
                    onPress={switchAuthModeHandler}
                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                  >
                    Patient Sign Up
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={switchAuthModeHandler}
                    style={[styles.button, { flex: 1, marginLeft: 8 }]}
                  >
                    Healthcare Sign Up
                  </Button>
                </View>
                <Divider style={{ height: 1 }} />
                {/* TODO: To be Google Sign in */}
                <Button
                  mode="contained-tonal"
                  icon="google"
                  onPress={() => {}}
                  style={[
                    styles.button,
                    {
                      height: 40,
                      marginTop: 16,
                      backgroundColor: theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  Google Sign In
                </Button>
                {/* TODO: To be removed */}
                {/* <View style={styles.buttons}>
                <FlatButton onPress={switchAuthModeHandler}>
                  {isLogin ? "Create a new user" : "Log in instead"}
                </FlatButton>
              </View> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* </ScrollView> */}
      </SafeAreaView>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: theme.colors.background }}
      />
    </>
  );
}

export default AuthContentLogin;

const styles = StyleSheet.create({
  titleText: {
    marginHorizontal: 16,
    marginTop: 56,
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
  baseText: {
    fontFamily: "Cochin",
  },
});
