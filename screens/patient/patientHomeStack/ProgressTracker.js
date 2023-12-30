import { KeyboardAvoidingView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button, Divider, Icon, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { VIDEO_STATUS } from "../../../constants/constants";

export default function ProgressTracker() {
  const theme = useTheme();

  const videoData = [
    {
      uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
      status: "pending",
    },
    {
      uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
      status: "rejected",
    },
    {
      uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-28")),
      status: "accepted",
    },
  ];

  const startDate = new Date("2023-12-01"); // Replace with your start date
  const today = new Date(); // Replace with your start date

  const marked = useMemo(() => {
    const markedDates = {};
    while (startDate <= today) {
      const dateString = startDate.toISOString().slice(0, 10);
      const video = videoData.find(
        (v) =>
          v.uploaded_timestamp.toDate().toISOString().slice(0, 10) ===
          dateString
      );

      //Excluide date other than today
      if (startDate < today) {
        if (!video || video.status === VIDEO_STATUS.REJECTED) {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.errorContainer,
            selectedTextColor: theme.colors.onBackground,
          };
        } else if (video.status === VIDEO_STATUS.PENDING) {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.surfaceContainerHigh,
            selectedTextColor: theme.colors.onBackground,
          };
        } else {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.primaryFixedDim,
            selectedTextColor: theme.colors.onBackground,
          };
        }
      }
      startDate.setDate(startDate.getDate() + 1); // Move to the next date
    }
    return markedDates;
  }, [startDate, today, videoData]);

  function checkTodayVideo() {
    const todayVideo = videoData.find(
      (v) =>
        v.uploaded_timestamp.toDate().toISOString().slice(0, 10) ===
        today.toISOString().slice(0, 10)
    );
    return todayVideo;
  }

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      >
        <View>
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
          />
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <Legend
            color={theme.colors.primaryFixedDim}
            text={"Video Submitted"}
          />
          <Legend color={theme.colors.errorContainer} text={"Video Missed"} />
          <Legend
            color={theme.colors.surfaceContainerHigh}
            text={"Video Pending"}
          />
        </View>
        <Divider />
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          {checkTodayVideo && checkTodayVideo.status === VIDEO_STATUS.ACCEPTED
            ? "You have completed your medication today!"
            : "You haven't complete your medication today."}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const Legend = ({ color, text }) => {
  return (
    <View
      style={{ marginLeft: 16, marginBottom: 16, flexDirection: "row-reverse" }}
    >
      <Text variant="labelMedium" style={{ marginLeft: 4 }}>
        {text}
      </Text>
      <Icon source="circle" color={color} size={16} />
    </View>
  );
};
