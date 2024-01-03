import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navigation from "./navigation/Navigation";
import { baseVariants, customVariants } from "./constants/customFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/redux/store";
import {
  authenticateStoreNative,
  fetchPatientData,
} from "./store/redux/authSlice";
import * as SplashScreen from "expo-splash-screen";
import { fetchDocument } from "./util/firestoreWR";
import { Alert } from "react-native";
// import { AuthContext } from "./store/auth-context";

//Open SplashScreen for loading
SplashScreen.preventAutoHideAsync();

//A function to handle the initialization of log in status of the user.
//Fetching the user token from thee local storage of the device if available.
//While fetching, display loading screen.
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchToken() {
      const auth = getAuth();
      const user = auth.currentUser;
      // console.log("User now: " + user.uid);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          async (user) => {
            const token = await user.getIdTokenResult().token;
            console.log("Starting token: " + token);
            dispatch(authenticateStoreNative(token, user.uid));
          };
          // console.log("Display name: " + user.getIdTokenResult());
          // dispatch(authenticateStoreNative(await user.getIdTokenResult()), user.uid);
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          // const uid = user.uid;
          // ...
        } else {
          async (user) => {
            const token = await user.getIdTokenResult().token;
            console.log("Starting token: " + token);
            dispatch(authenticateStoreNative(token, user.uid));
          };
          // console.log("Display name: " + user.getIdTokenResult());
        }
      });
      const storedToken = await SecureStore.getItemAsync("token");
      console.log("Initialized token:" + storedToken);
      if (storedToken != "" && storedToken != null) {
        const storedUid = await SecureStore.getItemAsync("uid");
        console.log("Initialized uid:" + storedUid);
        dispatch(authenticateStoreNative(storedToken, storedUid));
        const patientUser = await fetchDocument("patient", storedUid);
        if (patientUser != null) {
          dispatch(
            fetchPatientData({
              age: patientUser.age,
              compliance_status: patientUser.compliance_status,
              data_of_diagnosis: patientUser.data_of_diagnosis,
              diagnosis: patientUser.diagnosis,
              email: patientUser.email,
              first_name: patientUser.first_name,
              gender: patientUser.gender,
              last_name: patientUser.last_name,
              nationality: patientUser.nationality,
              notes: patientUser.notes,
              nric_passport: patientUser.nric_passport,
              number_of_tablets: patientUser.number_of_tablets,
              phone_number: patientUser.phone_number,
              profile_pic_url: patientUser.profile_pic_url,
              treatment: patientUser.treatment,
              treatment_duration_months: patientUser.treatment_duration_months,
            })
          );
        }else{
          const healthcareUser = await fetchDocument("healthcare", storedUid);
          dispatch(
            fetchPatientData({
              email: healthcareUser.email,
              first_name: healthcareUser.first_name,
              last_name: healthcareUser.last_name,
              profile_pic_url: healthcareUser.profile_pic_url,
              category: healthcareUser.category,
              role: healthcareUser.role,
              staff_id: healthcareUser.staff_id,
            })
          );
        }
        Alert.alert("Welcome back!", "You have been logged in automatically.");
      }
      setIsTryingLogin(false);
    }

    // Initialise the React Native Paper Calendar library
    registerTranslation("en-GB", enGB);

    fetchToken();
  }, []);

  //Close Splash screen after fetched token
  if (isTryingLogin) {
    SplashScreen.hideAsync();
  }

  return <Navigation />;
}

//Define the theme for the app, which is the color and the typography
const lightThemeColors = require("./constants/light-theme-colors.json");
const lightThemeCustomColors = require("./constants/light-theme-custom-colors.json");

const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({
    config: {
      ...baseVariants,
      ...customVariants,
    },
  }),
  colors: {
    ...lightThemeColors.colors,
    ...lightThemeCustomColors.customColors,
  },
};

//Apps Starts here
export default function App() {
  const [loaded] = useFonts({
    "DMSans-Thin": require("./assets/fonts/DMSans-Thin.ttf"),
    "DMSans-ExtraLight": require("./assets/fonts/DMSans-ExtraLight.ttf"),
    "DMSans-Light": require("./assets/fonts/DMSans-Light.ttf"),
    "DMSans-Regular": require("./assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Medium": require("./assets/fonts/DMSans-Medium.ttf"),
    "DMSans-SemiBold": require("./assets/fonts/DMSans-SemiBold.ttf"),
    "DMSans-Bold": require("./assets/fonts/DMSans-Bold.ttf"),
    "DMSans-ExtraBold": require("./assets/fonts/DMSans-ExtraBold.ttf"),
    "DMSans-Black": require("./assets/fonts/DMSans-Black.ttf"),
    "DMSans-Italic": require("./assets/fonts/DMSans-Italic.ttf"),
    "DMSans-BoldItalic": require("./assets/fonts/DMSans-BoldItalic.ttf"),
    "DMSans-ExtraBoldItalic": require("./assets/fonts/DMSans-ExtraBoldItalic.ttf"),
    "DMSans-BlackItalic": require("./assets/fonts/DMSans-BlackItalic.ttf"),
    "DMSans-ExtraLightItalic": require("./assets/fonts/DMSans-ExtraLightItalic.ttf"),
    "DMSans-LightItalic": require("./assets/fonts/DMSans-LightItalic.ttf"),
    "DMSans-MediumItalic": require("./assets/fonts/DMSans-MediumItalic.ttf"),
    "DMSans-SemiBoldItalic": require("./assets/fonts/DMSans-SemiBoldItalic.ttf"),
    "DMSans-ThinItalic": require("./assets/fonts/DMSans-ThinItalic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <AuthContextProvider> */}
        <PaperProvider theme={lightTheme}>
          <BottomSheetModalProvider>
            <StatusBar style="dark" />
            <Root />
          </BottomSheetModalProvider>
        </PaperProvider>
      </Provider>
      {/* </AuthContextProvider> */}
    </GestureHandlerRootView>
  );
}
