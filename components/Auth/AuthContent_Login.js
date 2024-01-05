import { useState } from "react";
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
    if (isLogin) {
      navigation.navigate("SignInInfoScreen", { signUpMode: mode });
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {
    email = enteredEmail.trim();
    password = enteredPassword.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid) {
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
                    Please enter your email to reset password
                  </Text>
                  <TextInput
                    mode="outlined"
                    style={{ marginBottom: 40 }}
                    label="Forgot Email Address"
                    placeholder="Type your email"
                    onChangeText={(email) => setEnteredForgotEmail(email)}
                    value={enteredForgotEmail}
                    keyboardType="email-address"
                    // isInvalid={emailIsInvalid}
                  />
                  <View style={{ flexDirection: "row-reverse" }}>
                    <Button mode="contained" onPress={forgotPasswordHandler}>
                      Reset Password
                    </Button>
                    <Button
                      mode="contained-tonal"
                      onPress={hideModal}
                      style={{ marginRight: 16 }}
                    >
                      Cancel
                    </Button>
                  </View>
                </Modal>
              </Portal>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={[styles.titleText, { color: theme.colors.onPrimary }]}
                  variant="headlineLarge"
                >
                  Welcome to
                </Text>
                <Image
                  source={require("../../assets/TBLogoWhite.png")}
                  style={{ width: 150, height: 150 }}
                />
              </View>
              <View
                style={[
                  styles.authContent,
                  { backgroundColor: theme.colors.background },
                ]}
              >
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
                  onChangeText={updateInputValueHandler.bind(this, "password")}
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
                  Forgot Password?
                </Button>
                <View style={{ flexGrow: 1 }} />
                <Button
                  mode="contained"
                  onPress={submitHandler}
                  style={{ height: 40 }}
                >
                  Log In
                </Button>
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 16,
                    width: "100%",
                  }}
                >
                  <Button
                    mode="contained-tonal"
                    onPress={() => switchAuthModeHandler("patient")}
                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                  >
                    Patient Sign Up
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={() => switchAuthModeHandler("healthcare")}
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
