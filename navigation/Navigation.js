import { NavigationContainer } from "@react-navigation/native";

// import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import AuthStack from "./AuthStack";
import PatientStackGroup from "./PatientStack";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocument } from "../util/firestoreWR";
import { setFirstTimeLogin } from "../store/redux/authSlice";

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
  const uid = useSelector((state) => state.authObject.uid);
  const dispatch = useDispatch();

  if (authenticated) {
    patientExist = fetchDocument("patients", uid);
    healthCareExist = fetchDocument("healthcare", uid);

    if (patientExist) {
      dispatch(setFirstTimeLogin({ first_time_login: false }));
    } else if (healthCareExist) {
      dispatch(setFirstTimeLogin({ first_time_login: false }));
    }
  }

  return (
    <NavigationContainer>
      {authenticated ? (
        first_time_login ? (
          <AuthStack />
        ) : (
          <PatientStackGroup />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
