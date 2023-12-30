import { Image, Pressable, StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Chip, IconButton, Text, useTheme } from "react-native-paper";
import TextListButton from "../../components/ui/TextListButton";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { logoutDeleteNative } from "../../store/redux/authSlice";
import React from "react";

function PatientProfileScreen() {
  const theme = useTheme();
  const auth = getAuth();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  // React.useLayoutEffect(() => {
  //   navigate("PatientEditProfileScreen");
  // });

  function signOutHandler() {
    signOut(auth)
      .then(async () => {
        // Sign out successful
        console.log("User signed out successfully");
        dispatch(logoutDeleteNative());
        // navigation.navigate("Login");
        // Add any additional logic or navigation here
      })
      .catch((error) => {
        // An error occurred during sign out
        console.error("Error signing out:", error);
        // Handle the error or display an error message
      });
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      {/* ===================HEADER==================== */}
      <View style={[styles.homeHeader]}>
        {/* TODO Change the name to the patients image */}
        <Image
          source={require("../../assets/blank-profile-pic.png")}
          style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
        />
        <View style={[styles.headerText]}>
          {/* TODO Change the name to the patients name */}
          <Text variant="headlineLarge">Arul</Text>
          <View style={{ flexDirection: "row" }}>
            <Text variant="bodyLarge">You are doing </Text>
            <Text
              variant="bodyLarge"
              style={{ fontFamily: "DMSans-Bold", color: theme.colors.green }}
            >
              GOOD
            </Text>
            <Text variant="bodyLarge"> !</Text>
          </View>
        </View>
        <IconButton icon="pencil" size={24} onPress={() => {navigate("PatientEditProfileScreen")}} />
      </View>
      {/* ========================PERSONAL INFO======================= */}
      {/* TODO change the personal information */}
      <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap" }}>
        <Chip
          selected
          icon="gender-male-female"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Male
        </Chip>
        <Chip
          selected
          icon="card-account-details"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          173629073234
        </Chip>
        <Chip
          selected
          icon="face-man"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          21
        </Chip>
        <Chip selected icon="flag" style={{ marginRight: 8, marginBottom: 8 }}>
          Malaysia
        </Chip>
        <Chip selected icon="phone" style={{ marginRight: 8, marginBottom: 8 }}>
          +6011 74232381
        </Chip>
      </View>
      {/* ======================= Progress Tracker =================== */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
          // backgroundColor: theme.colors.surfaceContainerLow,
          height: "22%",
        }}
      >
        <IconButton
          style={{ position: "absolute", right: "0%", top: "0%" }}
          icon="arrow-top-right"
          size={24}
          onPress={() => {
            navigate("ProgressTracker");
          }}
        />
        <AnimatedCircularProgress
          size={280}
          width={15}
          fill={50} // The percentage of the progress is put here
          tintColor={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
          arcSweepAngle={180}
          rotation={270}
        >
          {(fill) => (
            <>
              <Text variant="headlineLarge">{fill}%</Text>
              <Text variant="titleMedium">Progress Completion</Text>
              <Text variant="labelLarge">1st Month</Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
            </>
          )}
        </AnimatedCircularProgress>
      </View>
      {/* ========================== Settings ======================= */}
      <TextListButton
        text={"Settings"}
        onPressCallback={() => navigate("PatientSettingsScreen")}
      />
      <TextListButton
        text={"History"}
        onPressCallback={() => navigate("PatientHistoryTab")}
      />
      <Button
        mode="contained"
        style={{ marginTop: 24 }}
        onPress={() => signOutHandler()}
      >
        Sign Out
      </Button>
    </View>
  );
}

export default PatientProfileScreen;

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
  },
  headerText: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
  toDoList: {
    paddingTop: 16,
    borderRadius: 16,
  },
  tbMaterial: {
    paddingTop: 16,
  },
});
