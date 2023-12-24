import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { configureFonts, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useFonts } from 'expo-font';
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AppLoading from "expo-app-loading";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
// import { baseVariants, customVariants } from "./constants/customFonts";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./components/ui/IconButton";
import CustomNavigationBar from "./components/ui/NavigationBar";

const Stack = createNativeStackNavigator();

//A prototype auth page
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

//A prototype home page after log in
function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

//A function component to choose the Entry Point for user based on the log in status
function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

//A function to handle the initialization of log in status of the user.
//Fetching the user token from thee local storage of the device if available.
//While fetching, display loading screen.
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedToken != "") {
        authCtx.authenticate(storedToken);
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

const baseFont = { fontFamily: "DMSans-Regular" };
const baseVariants = configureFonts({ config: baseFont });

// Then, define custom fonts for different variants
// Customize individual base variants:

const customVariants = {
  displayLarge: {
    ...baseVariants.displayLarge,
    fontFamily: "DMSans-Bold",
  },
  displayMedium: {
    ...baseVariants.displayMedium,
    fontFamily: "DMSans-Regular",
  },
  displaySmall: {
    ...baseVariants.displaySmall,
    fontFamily: "DMSans-Regular",
  },
  headlineLarge: {
    ...baseVariants.headlineLarge,
    fontFamily: "DMSans-Bold",
  },
  headlineMedium: {
    ...baseVariants.headlineMedium,
    fontFamily: "DMSans-Regular",
  },
  headlineSmall: {
    ...baseVariants.headlineSmall,
    fontFamily: "DMSans-Regular",
  },
  titleLarge: {
    ...baseVariants.titleLarge,
    fontFamily: "DMSans-Medium",
  },
  titleMedium: {
    ...baseVariants.titleMedium,
    fontFamily: "DMSans-Bold",
  },
  titleSmall: {
    ...baseVariants.titleSmall,
    fontFamily: "DMSans-Medium",
  },
  bodyLarge: {
    ...baseVariants.bodyLarge,
    fontFamily: "DMSans-Regular",
  },
  bodyMedium: {
    ...baseVariants.bodyMedium,
    fontFamily: "DMSans-Regular",
  },
  bodySmall: {
    ...baseVariants.bodySmall,
    fontFamily: "DMSans-Regular",
  },
  labelLargeProminent: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-SemiBold",
  },
  labelLarge: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-Medium",
  },
  labelMediumProminent: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
  },
  labelMedium: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
  },
  labelSmall: {
    ...baseVariants.labelSmall,
    fontFamily: "DMSans-Medium",
  },
};

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
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <PaperProvider theme={lightTheme}>
          <Root />
        </PaperProvider>
      </AuthContextProvider>
    </>
  );
}
