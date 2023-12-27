import { useContext, useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import AuthContentSignup from "../../components/Auth/AuthContent_Signup";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { createUser } from "../../util/firebaseAuth";
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
      const snapshot = await createUser(email, password);
      // authCtx.authenticate(token);
      // dispatch(authenticate({token : token}))

      dispatch(authenticateStoreNative(snapshot.token, snapshot.uid));
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

  return <AuthContentSignup onAuthenticate={signupHandler} />;
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
