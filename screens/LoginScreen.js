import AuthContent from "../components/Auth/AuthContent";
import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/auth";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState();

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
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
  
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
