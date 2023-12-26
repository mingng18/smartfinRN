import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AppLoading from "expo-app-loading";
// import { AuthContext } from "./store/auth-context";
import Navigation from "./navigation/Navigation";
import { baseVariants, customVariants } from "./constants/customFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider, useDispatch } from "react-redux";
import {store} from './store/redux/store'
import { authenticateStoreNative } from "./store/redux/authSlice";

//A function to handle the initialization of log in status of the user.
//Fetching the user token from thee local storage of the device if available.
//While fetching, display loading screen.
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  // const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchToken() {
      // await SecureStore.deleteItemAsync("token"); // temporary used to perform logout, dev only
      const storedToken = await SecureStore.getItemAsync("token");
      console.log("Initialized token:" + storedToken);
      if (storedToken != "" && storedToken != null) {
        // authCtx.authenticate(storedToken);
        dispatch(authenticateStoreNative(storedToken));
      }
      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
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

  // Initialise the React NAtive Paper Calendar library
  registerTranslation("en-GB", enGB);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <AuthContextProvider> */}
        <PaperProvider theme={lightTheme}>
          <BottomSheetModalProvider>
            <Root />
          </BottomSheetModalProvider>
        </PaperProvider>
      </Provider>
      {/* </AuthContextProvider> */}
    </GestureHandlerRootView>
  );
}
