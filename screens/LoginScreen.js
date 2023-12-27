import React, { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContentLogin from "../components/Auth/AuthContent_Login";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/firebaseAuth";
// import { AuthContext } from "../store/auth-context";
import { useDispatch } from "react-redux";
import { authenticateStoreNative } from "../store/redux/authSlice";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();
  const { navigate } = useNavigation();

  // const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    navigate("HealthcareInformationScreen");
  });


  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const snapshot = await login(email, password);
      // authCtx.authenticate(token);
      // dispatch(authenticate({token : token}))

      dispatch(authenticateStoreNative(snapshot.token, snapshot.uid));
    } catch (error) {
      Alert.alert(
        "Authentication failed! Please check your credentials or sign up a new account!"
      );
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContentLogin isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
