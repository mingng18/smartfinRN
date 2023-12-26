import { NavigationContainer } from "@react-navigation/native";
// import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import AuthStack from "./AuthStack";
import PatientStackGroup from "./PatientStack";
import { useSelector } from "react-redux";

//A function component to choose the Entry Point for user based on the log in status
//TODO determine healthcare login status
export default function Navigation() {
  // const authCtx = useContext(AuthContext);
  const authenticated = useSelector((state) => state.authObject.isAuthenticated);

  return (
    <NavigationContainer>
      {authenticated ? <AuthStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
