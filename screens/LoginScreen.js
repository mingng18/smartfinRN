import { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContentLogin from "../components/Auth/AuthContent_Login";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/auth";
// import { AuthContext } from "../store/auth-context";
import { useDispatch } from "react-redux";
import { authenticateStoreNative } from "../store/redux/authSlice";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();

  // const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      // authCtx.authenticate(token);
      // dispatch(authenticate({token : token}))

      dispatch(authenticateStoreNative(token));
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
