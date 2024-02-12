import React from "react";
import { SafeAreaView, View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Button, Text, useTheme } from "react-native-paper";
import { LOGO_BLACK_TYPE } from "../../constants/constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateSignupMode } from "../../store/redux/signupSlice";
import {
  logoutDeleteNative,
  setFirstTimeLogin,
} from "../../store/redux/authSlice";
import { authenticate } from "../../store/redux/authSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const ChooseYourAccountType = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authObject);

  React.useEffect(() => {
    console.log("ChooseYourAccountType token is : " + user.token);
    console.log("ChooseYourAccountType uid is : " + user.user_uid);
    // Logic for checking if user is authenticated
    SplashScreen.hideAsync();
  }, []);

  const handlePatientButtonPress = () => {
    // Logic for handling patient button press
    dispatch(updateSignupMode({signupMode: "patient"}));
    navigation.navigate("PersonalInformationScreen");
  };

  const handleHealthcareButtonPress = () => {
    // Logic for handling healthcare button press
    dispatch(updateSignupMode({signupMode: "healthcare"}));
    navigation.navigate("HealthcareInformationScreen");
  };

  return (
    <View
      style={{
        flex: 1,
        //   position: "absolute",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Image source={LOGO_BLACK_TYPE} style={{ width: 148, height: 148 }} />
      <Text variant="titleLarge" style={{ marginTop: 24, marginBottom: 8 }}>
        Welcome to MyTBCompanion
      </Text>
      <Text variant="bodyLarge">Who are you?</Text>
      <Button
        style={{
          backgroundColor: theme.colors.primaryContainer,
          marginVertical: 16,
        }}
        onPress={handlePatientButtonPress}
      >
        <Text variant="bodyLarge">Patient</Text>
      </Button>
      <Button
        style={{ backgroundColor: theme.colors.primaryContainer }}
        onPress={handleHealthcareButtonPress}
      >
        <Text variant="bodyLarge">Healthcare</Text>
      </Button>
      <Button
        style={{ marginTop: 16 }}
        onPress={() => {
          dispatch(logoutDeleteNative());
          auth().currentUser.delete();
          auth()
            .signOut()
            .then(() => console.log("User signed out!"));
          GoogleSignin.revokeAccess();
          dispatch(setFirstTimeLogin({ first_time_login: false }));
        }}
      >
        Back to Login
      </Button>
      {/* <Button title="Patient" onPress={handlePatientButtonPress} />
        <Button
          title="Healthcare Provider"
          onPress={handleHealthcareButtonPress}
        /> */}
    </View>
  );
};

export default ChooseYourAccountType;
