import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import AuthStack from "./AuthStack";
import PatientStackGroup from "./PatientStack";

//A function component to choose the Entry Point for user based on the log in status
//TODO determine healthcare login status
export default function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <PatientStackGroup /> : <AuthStack />}
    </NavigationContainer>
  );
}
