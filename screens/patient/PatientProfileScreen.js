import { Image, Pressable, StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Chip, IconButton, Text, useTheme } from "react-native-paper";
import TextListButton from "../../components/ui/TextListButton";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { logoutDeleteNative } from "../../store/redux/authSlice";
import React from "react";
import { BLANK_PROFILE_PIC } from "../../constants/constants";
import { capitalizeFirstLetter } from "../../util/capsFirstWord";

function PatientProfileScreen() {
  const theme = useTheme();
  const auth = getAuth();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const user = useSelector((state) => state.authObject);
  const videos = useSelector((state) => state.videoObject.videos);

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

  function calculateProgress() {
    const diagnosisDate = new Date(user.date_of_diagnosis);
    const duration = user.treatment_duration_months; // Assuming user.treatment_duration_months is a number representing months

    // Get the current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate the diagnosis end date by adding the duration of treatment to the diagnosis date
    const diagnosisEndDate = new Date(
      diagnosisDate.getFullYear(),
      diagnosisDate.getMonth() + duration,
      diagnosisDate.getDate()
    );

    // Check if the diagnosis end date is in the current month
    if (
      diagnosisEndDate.getFullYear() === currentYear &&
      diagnosisEndDate.getMonth() === currentMonth
    ) {
      // Calculate the remaining days in the current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const remainingDays = daysInMonth - currentDate.getDate();

      // Calculate the percentage based on videos submitted and remaining days
      const videosSubmittedThisMonth = videos.filter((video) => {
        const uploadedDate = new Date(video.uploaded_timestamp);
        return (
          uploadedDate.getMonth() === currentMonth &&
          uploadedDate.getFullYear() === currentYear
        );
      });

      const percentageSubmitted = Math.round(
        (videosSubmittedThisMonth.length / remainingDays) * 100
      );

      return percentageSubmitted;
    } else {
      // If the diagnosis end date is not in the current month,
      // calculate progress based on days of month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const videosSubmittedThisMonth = videos.filter((video) => {
        const uploadedDate = new Date(video.uploaded_timestamp);
        return (
          uploadedDate.getMonth() === currentMonth &&
          uploadedDate.getFullYear() === currentYear
        );
      });

      const percentageSubmitted = Math.round(
        (videosSubmittedThisMonth.length / daysInMonth) * 100
      );

      return percentageSubmitted;
    }
  }

  function monthsSinceDiagnosis() {
//     const today = new Date();
//     // const diagnosis = user.date_of_diagnosis.toDate();
// // console.log(diagnosis)

//     // const months =
//       // (today.getFullYear() - diagnosis.getFullYear()) * 12 +
//       // today.getMonth() -
//       // diagnosis.getMonth();
//     // return months + 1;
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
          source={
            user.profile_pic_url
              ? { uri: user.profile_pic_url }
              : BLANK_PROFILE_PIC
          }
          style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
        />
        <View style={[styles.headerText]}>
          {/* TODO Change the name to the patients name */}
          <Text variant="headlineLarge">
            {capitalizeFirstLetter(user.first_name)}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text variant="bodyLarge">You are doing </Text>
            <Text
              variant="bodyLarge"
              style={{ fontFamily: "DMSans-Bold", color: theme.colors.green }}
            >
              {user.compliance_status
                ? user.compliance_status.toUpperCase()
                : "NICE"}
            </Text>
            <Text variant="bodyLarge"> !</Text>
          </View>
        </View>
        <IconButton
          icon="pencil"
          size={24}
          onPress={() => {
            navigate("PatientEditProfileScreen");
          }}
        />
      </View>
      {/* ========================PERSONAL INFO======================= */}
      {/* TODO change the personal information */}
      <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap" }}>
        <Chip
          selected
          icon="gender-male-female"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          {capitalizeFirstLetter(user.gender)}
        </Chip>
        <Chip
          selected
          icon="card-account-details"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          {capitalizeFirstLetter(user.nric_passport)}
        </Chip>
        <Chip
          selected
          icon="face-man"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          {user.age}
        </Chip>
        <Chip selected icon="flag" style={{ marginRight: 8, marginBottom: 8 }}>
          {capitalizeFirstLetter(user.nationality)}
        </Chip>
        <Chip selected icon="phone" style={{ marginRight: 8, marginBottom: 8 }}>
          {user.phone_number}
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
          prefill={calculateProgress()}
          fill={calculateProgress()}
          tintColor={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
          arcSweepAngle={180}
          rotation={270}
        >
          {(fill) => (
            <>
              <Text variant="headlineLarge">{fill}%</Text>
              <Text variant="titleMedium">Progress Completion</Text>
              <Text variant="labelLarge">
                {/* {console.log(monthsSinceDiagnosis())} */}
                {monthsSinceDiagnosis()}
                {monthsSinceDiagnosis() === 1
                  ? "st"
                  : monthsSinceDiagnosis() === 2
                  ? "nd"
                  : monthsSinceDiagnosis() === 3
                  ? "rd"
                  : "th"}
                {` month`}
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }} />
              <Text variant="labelLarge" style={{ opacity: 0 }} />
              <Text variant="labelLarge" style={{ opacity: 0 }} />
              <Text variant="labelLarge" style={{ opacity: 0 }} />
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
