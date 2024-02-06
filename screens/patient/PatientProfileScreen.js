import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Chip, IconButton, Text, useTheme } from "react-native-paper";
import TextListButton from "../../components/ui/TextListButton";
// import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { logoutDeleteNative } from "../../store/redux/authSlice";
import React from "react";
import { BLANK_PROFILE_PIC } from "../../constants/constants";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import InformationChip from "../../components/ui/InformationChip";
import { SafeAreaView } from "react-native-safe-area-context";
import CachedImage from "expo-cached-image";
import { clearAppointmentDateSlice } from "../../store/redux/bookedAppointmentDateSlice";
import { clearAppointmentSlice } from "../../store/redux/appointmentSlice";
import { clearSideEffectSlice } from "../../store/redux/sideEffectSlice";
import { clearVideoSlice } from "../../store/redux/videoSlice";
import { clearSignupSlice } from "../../store/redux/signupSlice";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import auth from "@react-native-firebase/auth";

function PatientProfileScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const user = useSelector((state) => state.authObject);
  const videos = useSelector((state) => state.videoObject.videos);
  const today = new Date();
  const { t } = useTranslation("patient");

  // React.useLayoutEffect(() => {
  //   navigate("PatientEditProfileScreen");
  // });

  function clearLocalData() {
    dispatch(logoutDeleteNative());
    dispatch(clearAppointmentDateSlice());
    dispatch(clearAppointmentSlice());
    dispatch(clearSideEffectSlice());
    dispatch(clearVideoSlice());
    dispatch(clearSignupSlice());
  }

  function signOutHandler() {
    Alert.alert(t("signing_out_message"), t("confirmation_message"), [
      {
        text: t("sign_out_button_label"),
        onPress: () => {
          auth()
            .signOut()
            .then(() => {
              console.log("User signed out!");
              clearLocalData();
            })
            .catch((error) => {
              // An error occurred during sign out
              console.error("Error signing out:", error);
              Alert.alert(
                t("error_signing_out_title"),
                t("error_signing_out_message")
              );
            });
        },
      },
      {
        text: t("cancel_button_label"),
        style: "cancel",
      },
    ]);
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

  const monthsSinceDiagnosis = React.useMemo(() => {
    const diagnosis = new Date(user.date_of_diagnosis);
    console.log(diagnosis);

    const months =
      (today.getFullYear() - diagnosis.getFullYear()) * 12 +
      today.getMonth() -
      diagnosis.getMonth();
    return months + 1;
  });

  const streakCounter = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    let count = videos.reduce((acc, video) => {
      const uploadedDate = new Date(video.uploaded_timestamp);
      if (uploadedDate >= sevenDaysAgo && uploadedDate <= today) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return count;
  };

  const getTotalVideosForCurrentMonth = () => {
    // Get the first day of the current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Get the last day of the current month
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Filter the videos submitted within the current month

    let count = videos.reduce((acc, video) => {
      const uploadedDate = new Date(video.uploaded_timestamp);
      if (uploadedDate >= firstDayOfMonth && uploadedDate <= lastDayOfMonth) {
        return acc + 1;
      }
      return acc;
    }, 0);

    console.log(count);
    // Return the total number of videos submitted this month
    return count;
  };

  return (
    <SafeAreaView edges={["right", "left", "top"]}>
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        {/* ===================HEADER==================== */}
        <View style={[styles.homeHeader]}>
          {user.profile_pic_url && user.profile_pic_url !== "" ? (
            <CachedImage
              source={{ uri: user.profile_pic_url }}
              cacheKey={`${getLastTenCharacters(user.profile_pic_url)}`}
              defaultSource={BLANK_PROFILE_PIC}
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
          ) : (
            <Image
              source={BLANK_PROFILE_PIC}
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
          )}
          <View style={[styles.headerText]}>
            <View style={{ flexDirection: "row" }}>
              <Text variant="bodyLarge">
                {streakCounter() === 7
                  ? t("keep_it_up_message")
                  : streakCounter() > 1
                  ? t("take_medication_message")
                  : t("you_can_do_better_message")}
              </Text>
            </View>
            <Text variant="headlineLarge">
              {capitalizeFirstLetter(user.first_name)}
            </Text>
          </View>
          <Button
            onPress={() => {
              navigate("PatientEditProfileScreen");
            }}
            mode="text"
          >
            Edit
          </Button>
        </View>
        {/* ========================PERSONAL INFO======================= */}
        {/* TODO change the personal information */}
        <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap" }}>
          <InformationChip
            text={user.nric_passport}
            icon={"card-account-details"}
            style={{ width: "60%" }}
          />
          <InformationChip
            text={t(user.gender.toLowerCase())}
            icon={"gender-male-female"}
            style={{ width: "40%" }}
          />
          <InformationChip
            text={user.phone_number}
            icon={"phone"}
            style={{ width: "60%" }}
          />
          <InformationChip
            text={user.age}
            icon={"face-man"}
            style={{ width: "40%" }}
          />
          <InformationChip
            text={user.nationality}
            icon={"flag"}
            style={{ width: "60%" }}
          />
        </View>
        {/* ======================= Progress Tracker =================== */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 32,
            // marginBottom: 24,
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
            tintColor={
              calculateProgress() > 70
                ? theme.colors.greenContainer
                : theme.colors.primary
            }
            backgroundColor={theme.colors.primaryContainer}
            arcSweepAngle={180}
            rotation={270}
          >
            {(fill) => (
              <>
                <Text variant="headlineLarge">{fill}%</Text>
                <Text variant="titleMedium">
                  {t("progress_completion_title")}
                </Text>
                <Text variant="labelSmall">
                  {`${getTotalVideosForCurrentMonth()} ${t(
                    "video_submitted_for_text"
                  )}`}
                  {monthsSinceDiagnosis === 1
                    ? t("month_one", { count: 1 })
                    : monthsSinceDiagnosis === 2
                    ? t("month_two", { count: 2 })
                    : monthsSinceDiagnosis === 3
                    ? t("month_three", { count: 3 })
                    : t("month_four", { count: monthsSinceDiagnosis })}
                </Text>
                <Text variant="labelSmall" style={{ opacity: 1 }}>
                  {`${videos.length}${t("video_submitted_in_total_text")}`}
                </Text>
                <Text variant="labelLarge" style={{ opacity: 0 }} />
                <Text variant="labelLarge" style={{ opacity: 0 }} />
                <Text variant="labelLarge" style={{ opacity: 0 }} />
              </>
            )}
          </AnimatedCircularProgress>
        </View>
        {/* ========================== Settings ======================= */}
        <TextListButton
          text={t("settings")}
          onPressCallback={() => navigate("PatientSettingsScreen")}
        />
        <TextListButton
          text={t("history")}
          onPressCallback={() => navigate("PatientHistoryTab")}
        />
        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          onPress={() => signOutHandler()}
        >
          {t("sign_out")}
        </Button>
      </ScrollView>
    </SafeAreaView>
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
