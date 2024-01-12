import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { SIDE_EFFECT_STATUS } from "../../../constants/constants";
import { capitalizeFirstLetter } from "../../../util/wordUtil";

export default function SideEffectDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentSideEffect = params.sideEffect;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Side Effect",
    });
  });

  function PendingSideEffectCard() {
    return (
      <Text variant="bodyLarge" style={{ marginTop: 24 }}>
        Please wait patiently as your report is currently under reviewed by the
        healthcare.
      </Text>
    );
  }

  function ReviewedSideEffectCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 24 }}>
          Remarks
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentSideEffect.remarks}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        Date and time reported
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text>
          {currentSideEffect.side_effect_occuring_timestamp.slice(0, 10)}
        </Text>
        <Text>
          {new Date(
            currentSideEffect.side_effect_occuring_timestamp
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </Text>
      </View>
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        Symptoms
      </Text>
      <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap" }}>
        {currentSideEffect.symptoms.map((symptom, i) => {
          return (
            <Chip
              key={i}
              style={{
                marginRight: 8,
                marginBottom: 8,
                backgroundColor:
                  symptom.grade == 3
                    ? theme.colors.errorContainer
                    : symptom.grade == 2
                    ? theme.colors.yellowContainer
                    : theme.colors.secondaryContainer,
              }}
            >
              {symptom.grade == 0
                ? capitalizeFirstLetter(symptom.label)
                : `${capitalizeFirstLetter(symptom.label)} : ${symptom.grade}`}
            </Chip>
          );
        })}
      </View>
      {currentSideEffect.se_status === SIDE_EFFECT_STATUS.REVIEWED &&
        ReviewedSideEffectCard()}
      {currentSideEffect.se_status === SIDE_EFFECT_STATUS.PENDING &&
        PendingSideEffectCard()}
    </View>
  );
}
