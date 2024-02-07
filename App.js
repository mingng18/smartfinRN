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
import auth from "@react-native-firebase/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider, useDispatch } from "react-redux";
import "expo-dev-client";

import Navigation from "./navigation/Navigation";
import { customVariants } from "./constants/customFonts";
import { store } from "./store/redux/store";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "./store/redux/authSlice";
import * as SplashScreen from "expo-splash-screen";
import { editDocument, fetchDocument } from "./util/firestoreWR";
import { fetchAppointments } from "./store/redux/appointmentSlice";
import { FIREBASE_COLLECTION } from "./constants/constants";
import { fetchSideEffects } from "./store/redux/sideEffectSlice";
import { fetchVideos } from "./store/redux/videoSlice";
import { USER_TYPE } from "./constants/constants";
import { fetchPatientCollectionData } from "./store/redux/patientDataSlice";
import { Alert, LogBox, PermissionsAndroid, Platform } from "react-native";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import calendarLocales, {
  changeCalendarsLocales,
} from "./util/calendarLocales";
import messaging from "@react-native-firebase/messaging";
import { firebase } from "@react-native-firebase/firestore";
// import { getMessaging, getToken } from "firebase/messaging";

//Open SplashScreen for loading
SplashScreen.preventAutoHideAsync();

//A function to handle the initialization of log in status of the user.
//Fetching the user token from thee local storage of the device if available.
//While fetching, display loading screen.
function Root() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  // Ignore log notification by message
  // LogBox.ignoreLogs(["Warning: ..."]);
  // LogBox.ignoreAllLogs();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    async function fetchToken() {
      // const auth = getAuth();
      // const user = auth.currentUser;
      try {
        const token = await user.getIdToken();
      } catch (error) {
        console.log("No user");
      }

      const storedToken = await SecureStore.getItemAsync("token");
      console.log("Initialized token:" + storedToken);
      if (storedToken != "" && storedToken != null) {
        const storedUid = await SecureStore.getItemAsync("uid");
        console.log("Initialized uid:" + storedUid);
        try {
          const patientUser = await fetchDocument(
            FIREBASE_COLLECTION.PATIENT,
            storedUid
          );
          dispatch(authenticateStoreNative(storedToken, storedUid, "patient"));
          dispatch(
            fetchPatientData({
              ...patientUser,
              date_of_diagnosis: patientUser.date_of_diagnosis
                .toDate()
                .toISOString(),
              treatment_start_date: patientUser.treatment_start_date
                .toDate()
                .toISOString(),
              treatment_end_date: patientUser.treatment_end_date
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

          console.log("basuhdhas");
          dispatch(
            authenticateStoreNative(storedToken, storedUid, "healthcare")
          );
          console.log("basuhdhas");
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

  //Request permission for android
  const requestUserPermission = async () => {
    try {
      if (Platform.OS === "android") {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } else if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log("Authorization status:", authStatus);
        return enabled;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  };

  //Firebase Messaging inititalisation
  useEffect(() => {
    //Firebase FCM
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then(async (token) => {
          console.log("The notification token is " + token);
          const storedUid = await SecureStore.getItemAsync("uid");
          try {
            const patientUser = await fetchDocument(
              FIREBASE_COLLECTION.PATIENT,
              storedUid
            );
            editDocument(FIREBASE_COLLECTION.PATIENT, patientUser.id, {
              pushNotificationToken: token,
            });
            console.log("Token updated in Patient");
          } catch (error) {
            const healthcareUser = await fetchDocument(
              FIREBASE_COLLECTION.HEALTHCARE,
              storedUid
            );
            editDocument(FIREBASE_COLLECTION.HEALTHCARE, healthcareUser.id, {
              push_notification_token: token,
            });
            console.log("Token updated in Healthcare");
          }
        });
    } else {
      console.log("Failed token status", authStatus);
    }

    //Check whether an the notification is open from app quit state
    // messaging()
    //   .getInitialNotification()
    //   .then((message) => {
    //     console.log(
    //       "Notification caused app to open from quit state",
    //       message.notification
    //     );
    //     // const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    //     // if (typeof deeplinkURL === "string") {
    //     //   return deeplinkURL;
    //     // }
    //   });

    // //Check whether the notification is opened from app background state
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log(
    //     "Notification caused app to open from background state",
    //     remoteMessage.notification
    //   );
    //   //TODO link the meeting link here
    //   // const url = buildDeepLinkFromNotificationData(remoteMessage.data);
    //   // if (typeof url === "string") {
    //   //   listener(url);
    //   // }
    // });

    // Register background handler for app in background and quit state
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    //Handle notification in foreground state
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  //Close Splash screen after fetched token
  if (isTryingLogin || initializing) {
    SplashScreen.hideAsync();
  }

  return <Navigation />;
}

function buildDeepLinkFromNotificationData(data) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn("Unverified navigationId", navigationId);
    return null;
  }
  if (navigationId === "home") {
    return "myapp://home";
  }
  if (navigationId === "settings") {
    return "myapp://settings";
  }
  const postId = data?.postId;
  if (typeof postId === "string") {
    return `myapp://post/${postId}`;
  }
  console.warn("Missing postId");
  return null;
}

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
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={lightTheme}>
            <BottomSheetModalProvider>
              <StatusBar style="dark" />
              <Root />
            </BottomSheetModalProvider>
          </PaperProvider>
        </I18nextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
