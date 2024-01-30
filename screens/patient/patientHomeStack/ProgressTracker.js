import { KeyboardAvoidingView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button, Divider, Icon, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { VIDEO_STATUS } from "../../../constants/constants";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Legend from "../../../components/ui/Legend";
import { useTranslation } from "react-i18next";

export default function ProgressTracker() {
  const theme = useTheme();
  const videos = useSelector((state) => state.videoObject.videos);
  const [hasAteMedicine, setHasAteMedicine] = React.useState(false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.authObject);
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("progress_tracker_header_title"),
    });
  }, [t]);

  React.useEffect(() => {
    //Check if the patient has ate medicine today
    const calculateHasAteMedicine = () => {
      const vid = videos.filter((video) => {
        return (
          new Date(video.uploaded_timestamp).toISOString().slice(0, 10) ===
          new Date().toISOString().slice(0, 10)
        );
      });
      setHasAteMedicine(vid.length > 0);
    };

    calculateHasAteMedicine();
  }, [videos]);

  const marked = useMemo(() => {
    const markedDates = {};
    const startDate = new Date(user.date_of_diagnosis);
    const today = new Date();

    //Determine whether the patient has ended the treatment, thus stop tracking
    const treatmentEndDate = new Date(startDate);
    treatmentEndDate.setMonth(
      treatmentEndDate.getMonth() + user.treatment_duration_months
    );

    //Plus 1 day to include today
    // const endDate = today >= treatmentEndDate ? treatmentEndDate : today;
    // endDate.setDate(endDate.getDate() + 1);

    while (startDate <= treatmentEndDate) {
      const dateString = startDate.toISOString().slice(0, 10);
      const video = videos.find(
        (v) => v.uploaded_timestamp.slice(0, 10) === dateString
      );

      if (video) {
        markedDates[dateString] = {
          selected: true,
          selectedColor: theme.colors.greenContainer,
          selectedTextColor: theme.colors.onBackground,
          disableTouchEvent: true,
        };
      } else if (!video && startDate <= today) {
        markedDates[dateString] = {
          selected: true,
          selectedColor: theme.colors.errorContainer,
          selectedTextColor: theme.colors.onBackground,
          disableTouchEvent: true,
        };
      } else {
        markedDates[dateString] = {
          selected: true,
          selectedColor: theme.colors.surfaceContainerHigh,
          selectedTextColor: theme.colors.onBackground,
          disableTouchEvent: true,
        };
      }
      startDate.setDate(startDate.getDate() + 1); // Move to the next date
    }
    return markedDates;
  }, [videos]);

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      >
        <Calendar
          theme={{
            calendarBackground: theme.colors.background,
            monthTextColor: theme.colors.onBackground,
            textDayFontFamily: "DMSans-Regular",
            textMonthFontFamily: "DMSans-Regular",
            textDayHeaderFontFamily: "DMSans-Regular",
            arrowColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
          }}
          markedDates={marked}
          // disabledByDefault
        />
        <View
          style={{
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <Legend
            color={theme.colors.greenContainer}
            text={t("video_submitted_legend_text")}
          />
          <Legend
            color={theme.colors.errorContainer}
            text={t("video_missed_legend_text")}
          />
        </View>
        <Divider />
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          {hasAteMedicine
            ? t("completed_medication_text")
            : t("incomplete_medication_text")}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
