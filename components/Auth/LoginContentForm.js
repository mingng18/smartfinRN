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
import { LOGO_NO_TYPE } from "../../constants/constants";

function LoginContentForm({ onAuthenticate }) {
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
  const [hidePassword, setHidePassword] = useState(true);

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
                  Log In
                </Text>
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
                {/* TODO: To be Google Sign in */}
                <Button
                  mode="contained-tonal"
                  icon="google"
                  onPress={() => {}}
                  style={[
                    {
                      height: 40,
                      marginVertical: 16,
                      backgroundColor: theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  Google Sign In
                </Button>
                <Divider style={{ height: 1 }} />
                <Text
                  variant="labelLarge"
                  style={{ alignSelf: "center", marginTop: 16 }}
                >
                  Sign up as
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
                    Patient
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={() => switchAuthModeHandler("healthcare")}
                    style={[{ flex: 1, marginLeft: 8 }]}
                  >
                    Healthcare
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
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center'
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
