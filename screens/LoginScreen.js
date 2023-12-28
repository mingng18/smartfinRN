import React, { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContentLogin from "../components/Auth/AuthContent_Login";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/firebaseAuth";
// import { AuthContext } from "../store/auth-context";
import { useDispatch } from "react-redux";
import { authenticateStoreNative } from "../store/redux/authSlice";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdTokenResult()
      // const snapshot = await login(email, password);
      // authCtx.authenticate(token);
      // dispatch(authenticate({token : token}))

      dispatch(authenticateStoreNative(token.token, user.uid));
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
