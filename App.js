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
import { customVariants } from "./constants/customFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider, useDispatch } from "react-redux";
import "expo-dev-client";

import { store } from "./store/redux/store";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "./store/redux/authSlice";
import * as SplashScreen from "expo-splash-screen";
import { fetchDocument } from "./util/firestoreWR";
import { fetchAppointments } from "./store/redux/appointmentSlice";
import { FIREBASE_COLLECTION } from "./constants/constants";
import { fetchSideEffects } from "./store/redux/sideEffectSlice";
import { fetchVideos } from "./store/redux/videoSlice";
import { USER_TYPE } from "./constants/constants";
import { fetchPatientCollectionData } from "./store/redux/patientDataSlice";
import { Alert, LogBox, PermissionsAndroid, Platform } from "react-native";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import calendarLocales from "./util/calendarLocales";
import messaging, { firebase } from "@react-native-firebase/messaging";
import { firebaseConfig } from "./util/firebaseConfig";
// import { getMessaging, getToken } from "firebase/messaging";

//Open SplashScreen for loading
SplashScreen.preventAutoHideAsync();

//A function to handle the initialization of log in status of the user.
//Fetching the user token from thee local storage of the device if available.
//While fetching, display loading screen.
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  // const messaging = getMessaging();
  // if (!firebase.apps.length) {
  // }

  // useEffect(() => {
  //   const messaging = getMessaging();
  //   getToken(messaging, { vapidKey: "<YOUR_PUBLIC_VAPID_KEY_HERE>" })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         // Send the token to your server and update the UI if necessary
  //         console.log(currentToken);
  //       } else {
  //         // Show permission request UI
  //         console.log(
  //           "No registration token available. Request permission to generate one."
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //       // ...
  //     });
  // }, []);

  LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs();

  // const requestUserPermission = async () => {
  //   try {
  //     if (Platform.OS === "android") {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //         {
  //           title: "Permission to receive notifications",
  //           message: "We need your permission to receive notifications",
  //           buttonPositive: "OK",
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log("Permission granted");
  //         return true;
  //       } else {
  //         console.log("Permission denied");
  //         return false;
  //       }
  //     } else if (Platform.OS === "ios") {
        
  //       const authStatus = await messaging().requestPermission();
  //       const enabled =
  //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //       console.log("Authorization status:", authStatus);
  //       return enabled;
  //     }
  //   } catch (error) {
  //     console.error("Error requesting permission:", error);
  //     return false;
  //   }
  // };

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
          };
          // console.log("Display name: " + user.getIdTokenResult());
        }
      });
      const storedToken = await SecureStore.getItemAsync("token");
      console.log("Initialized token:" + storedToken);
      if (storedToken != "" && storedToken != null) {
        const storedUid = await SecureStore.getItemAsync("uid");
        console.log("Initialized uid:" + storedUid);
        try {
          const patientUser = await fetchDocument("patient", storedUid);
          console.log("Fetching patient");
          dispatch(authenticateStoreNative(storedToken, storedUid, "patient"));
          dispatch(
            fetchPatientData({
              ...patientUser,
              date_of_diagnosis: patientUser.date_of_diagnosis
                .toDate()
                .toISOString(),
            })
          );
          dispatch(
            fetchAppointments({
              userId: storedUid,
              userType: USER_TYPE.PATIENT,
            })
          );
          dispatch(
            fetchSideEffects({ userId: storedUid, userType: USER_TYPE.PATIENT })
          );
          dispatch(
            fetchVideos({ userId: storedUid, userType: USER_TYPE.PATIENT })
          );
        } catch (error) {
          const healthcareUser = await fetchDocument(
            FIREBASE_COLLECTION.HEALTHCARE,
            storedUid
          );
          console.log(
            "healthcare email from firebase is: " + healthcareUser.email
          );
          console.log("got error? " + error);
          console.log("Fetching healthcare");

          dispatch(
            authenticateStoreNative(storedToken, storedUid, "healthcare")
          );
          dispatch(fetchHealthcareData({ ...healthcareUser }));
          dispatch(fetchPatientCollectionData());
          dispatch(
            fetchAppointments({
              userId: storedUid,
              userType: USER_TYPE.HEALTHCARE,
            })
          );
          dispatch(
            fetchSideEffects({
              userId: storedUid,
              userType: USER_TYPE.HEALTHCARE,
            })
          );
          dispatch(
            fetchVideos({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
          );
        }
      }
      setIsTryingLogin(false);
    }
    fetchToken();

    //Initialise Calendar Locale
    calendarLocales(i18n);
  }, []);

  //Firebase Messaging inititalisation
  // useEffect(() => {
  //   //Firebase FCM
  //   if (requestUserPermission()) {
  //     messaging()
  //       .getToken()
  //       .then((token) => {
  //         console.log(token);
  //       });
  //   } else {
  //     console.log("Failed token status", authStatus);
  //   }

  //   //Check whether an the notification is open from app quit state
  //   messaging()
  //     .getInitialNotification()
  //     .then((message) => {
  //       console.log(
  //         "Notification caused app to open from quit state",
  //         message.notification
  //       );
  //       // const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
  //       // if (typeof deeplinkURL === "string") {
  //       //   return deeplinkURL;
  //       // }
  //     });

  //   //Check whether the notification is opened from app background state
  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     console.log(
  //       "Notification caused app to open from background state",
  //       remoteMessage.notification
  //     );
  //     // const url = buildDeepLinkFromNotificationData(remoteMessage.data);
  //     // if (typeof url === "string") {
  //     //   listener(url);
  //     // }
  //   });

  //   // Register background handler for app in background and quit state
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log("Message handled in the background!", remoteMessage);
  //   });

  //   //Handle notification in foreground state
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;

  // }, []);

  //Close Splash screen after fetched token
  if (isTryingLogin) {
    SplashScreen.hideAsync();
  }

  return <Navigation />;
}

// function buildDeepLinkFromNotificationData(data) {
//   const navigationId = data?.navigationId;
//   if (!NAVIGATION_IDS.includes(navigationId)) {
//     console.warn('Unverified navigationId', navigationId)
//     return null;
//   }
//   if (navigationId === 'home') {
//     return 'myapp://home';
//   }
//   if (navigationId === 'settings') {
//     return 'myapp://settings';
//   }
//   const postId = data?.postId;
//   if (typeof postId === 'string') {
//     return `myapp://post/${postId}`
//   }
//   console.warn('Missing postId')
//   return null
// }

//Define the theme for the app, which is the color and the typography
const lightThemeColors = require("./constants/light-theme-colors.json");
const lightThemeCustomColors = require("./constants/light-theme-custom-colors.json");

const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({
    config: {
      // ...baseVariants,
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
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={lightTheme}>
            <BottomSheetModalProvider>
              <StatusBar style="dark" />
              <Root />
            </BottomSheetModalProvider>
          </PaperProvider>
        </I18nextProvider>
      </Provider>
      {/* </AuthContextProvider> */}
    </GestureHandlerRootView>
  );
}
