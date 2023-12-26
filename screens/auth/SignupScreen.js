import { useContext, useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import AuthContentSignup from "../../components/Auth/AuthContent_Signup";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { createUser } from "../../util/auth";
// import { AuthContext } from "../../store/auth-context";
import AuthForm from "../../components/Auth/AuthForm";
import { Text, useTheme, Button, Divider } from "react-native-paper";
import { useDispatch } from "react-redux";
import { authenticateStoreNative } from "../../store/redux/authSlice";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });
  const theme = useTheme();

  // const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      // authCtx.authenticate(token);
      // dispatch(authenticate({token : token}))
      
      dispatch(authenticateStoreNative(token));
    } catch (error) {
      Alert.alert(
        "Authentication failed, please check your input and try again later."
      );
      console.log(error);
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContentSignup onAuthenticate={signupHandler}/>;
  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
        {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "100%" }}>
              <View
                style={[
                  styles.authContent,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                {/* <AuthContentSignup
                  isLogin={true}
                  onSubmit={signupHandler}
                  credentialsInvalid={credentialsInvalid}
                /> */}
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

export default SignupScreen;

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