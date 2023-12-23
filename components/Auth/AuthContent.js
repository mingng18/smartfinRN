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
import { Text, useTheme, Button, Divider } from "react-native-paper";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { useNavigation } from "@react-navigation/native";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const theme = useTheme();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
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
                <AuthForm
                  isLogin={isLogin}
                  onSubmit={submitHandler}
                  credentialsInvalid={credentialsInvalid}
                />
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 16,
                    width: "100%",
                  }}
                >
                  <Button
                    mode="contained-tonal"
                    onPress={() => {}}
                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                  >
                    Patient Sign Up
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={() => {}}
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

export default AuthContent;

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
