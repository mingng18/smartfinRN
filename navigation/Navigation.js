import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import PatientStackGroup from "./PatientStack";
import HealthcareStackGroup from "./HealthcareStack";
import { useDispatch, useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";

import React from "react";

//A function component to choose the Entry Point for user based on the log in status
//TODO determine healthcare login status
export default function Navigation() {
  // const authCtx = useContext(AuthContext);
  const authenticated = useSelector(
    (state) => state.authObject.isAuthenticated
  );
  const first_time_login = useSelector(
    (state) => state.authObject.first_time_login
  );
  const user_type = useSelector((state) => state.authObject.user_type);
  const uid = useSelector((state) => state.authObject.uid);
  const dispatch = useDispatch();

  React.useState(() => {
    console.log("user type: " + user_type);
    console.log("authenticated: " + authenticated);
  }, [authenticated]);

  React.useEffect(() => {
    console.log("user type: " + user_type);
    console.log("authenticated: " + authenticated);
  }, []);
  // if (authenticated) {
  //   patientExist = fetchDocument("patients", uid);
  //   healthCareExist = fetchDocument("healthcare", uid);

  //   if (patientExist) {
  //     dispatch(setFirstTimeLogin({ first_time_login: false }));
  //   } else if (healthCareExist) {
  //     dispatch(setFirstTimeLogin({ first_time_login: false }));
  //   }
  // }

  //   return (
  //     <NavigationContainer>
  //       {authenticated ? <PatientStackGroup /> : <AuthStack />}
  //     </NavigationContainer>
  //   );
  // }

  return (
    <NavigationContainer>
      {authenticated == null ? (
        null
      ) : authenticated ? (
        user_type === "patient" ? (
          <PatientStackGroup />
        ) : (
          <HealthcareStackGroup />
        )
      ) : (
        <AuthStack />
      )}
      {/* {authenticated ? (
          user_type === "patient" ? (
            <PatientStackGroup />
            
          ) : (
            <HealthcareStackGroup />
          )
        
      ) : (
        <AuthStack />
      )} */}
    </NavigationContainer>
  );
}
