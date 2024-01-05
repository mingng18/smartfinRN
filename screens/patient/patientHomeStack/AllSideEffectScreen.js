import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import {} from "../../../assets/blank-profile-pic.png";
import {
  BLANK_PROFILE_PIC,
  SIDE_EFFECT_SEVERITY,
} from "../../../constants/constants";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/capsFirstWord";
import { useSelector } from "react-redux";

function AllSideEffectScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  ).sort((a, b) => {});

  const sortedSideEffects = [...sideEffects].sort((a, b) => {
    const timestampA = new Date(a.side_effect_occuring_timestamp);
    const timestampB = new Date(b.side_effect_occuring_timestamp);

    return timestampA < timestampB ? 1 : timestampA > timestampB ? -1 : 0;
  });

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
        {sideEffects.length > 0 ? (
          sortedSideEffects.map((sideEffect, i) => (
            <HorizontalCard
              key={i}
              //   profilePic={"lol"}
              subject={capitalizeFirstLetter(sideEffect.severity)}
              date={sideEffect.side_effect_occuring_timestamp.slice(0, 10)}
              time={new Date(
                sideEffect.side_effect_occuring_timestamp
              ).toLocaleTimeString("en-US", {
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
          ))
        ) : (
          <Text variant="bodyLarge">
            You don't have any reported side effects
          </Text>
        )}
      </ScrollView>
      <View style={{ marginBottom: 38 }} />
    </View>
  );
}

export default AllSideEffectScreen;
