import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {  useTheme } from "react-native-paper";
import {} from "../../../assets/blank-profile-pic.png";
import {
  BLANK_PROFILE_PIC,
  SIDE_EFFECT_SEVERITY,
} from "../../../constants/constants";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { Timestamp } from "firebase/firestore";
import { capitalizeFirstLetter } from "../../../util/capsFirstWord";

function AllSideEffectScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    //Query for all appointment, and seperate into
    // pending accpeted
    // past appointment
    //order by time
    // setCompleteAppointment(appointmentData);
    // setIncompleteAppointment(appointmentData);
  });

  const sideEffectData = [
    {
      side_effect_occuring_timestamp: Timestamp.fromDate(
        new Date("2023-12-21")
      ),
      severity: "severe",
      se_status: "pending",
      symptoms: ["cough", "blood"],
    },
    {
      side_effect_occuring_timestamp: Timestamp.fromDate(
        new Date("2023-12-21")
      ),
      severity: "moderate",
      se_status: "reviewed",
      symptoms: ["cough", "nausea"],
      remarks: "Drink more water",
    },
  ];

  //Determine the container color
  function containerColor(appointment) {
    return appointment.severity === SIDE_EFFECT_SEVERITY.SEVERE
      ? theme.colors.errorContainer
      : appointment.severity === SIDE_EFFECT_SEVERITY.MODERATE
      ? theme.colors.yellowContainer
      : theme.colors.surfaceContainer;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 16 }} />
        {sideEffectData.map((sideEffect, i) => (
          <HorizontalCard
            key={i}
            //   profilePic={"lol"}
            subject={capitalizeFirstLetter(sideEffect.severity)}
            date={sideEffect.side_effect_occuring_timestamp
              .toDate()
              .toISOString()
              .slice(0, 10)}
            time={sideEffect.side_effect_occuring_timestamp
              .toDate()
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            color={containerColor(sideEffect)}
            onPressedCallback={() => {
              navigation.navigate("SideEffectDetailsScreen", {
                sideEffect: sideEffect,
              });
            }}
          />
        ))}
      </ScrollView>
      <View style={{ marginBottom: 38 }} />
    </View>
  );
}

export default AllSideEffectScreen;
