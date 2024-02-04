import React from "react";
import SideEffectChip from "../../../components/ui/SideEffectChip";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";
import { SIDE_EFFECT_STATUS } from "../../../constants/constants";
import { useTranslation } from "react-i18next";

export default function SideEffectDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentSideEffect = params.sideEffect;
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("side_effect_title"),
    });
  });

  function PendingSideEffectCard() {
    return (
      <Text variant="bodyLarge" style={{ marginTop: 24 }}>
        {t("wait_patients_report_reviewed")}
      </Text>
    );
  }

  function ReviewedSideEffectCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 24 }}>
          {t("remarks_title")}
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentSideEffect.remarks === ""
            ? t("no_remarks_given")
            : currentSideEffect.remarks}
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
        {t("date_time_reported_title")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text variant="bodyLarge">
          {currentSideEffect.side_effect_occuring_timestamp.slice(0, 10)}
        </Text>
        <Text variant="bodyLarge">
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
        {t("symptoms_title")}
      </Text>
      <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap" }}>
        {currentSideEffect.symptoms.map((symptom, i) => {
          return <SideEffectChip symptom={symptom} key={i} />;
        })}
      </View>
      {currentSideEffect.se_status === SIDE_EFFECT_STATUS.REVIEWED &&
        ReviewedSideEffectCard()}
      {currentSideEffect.se_status === SIDE_EFFECT_STATUS.PENDING &&
        PendingSideEffectCard()}
    </View>
  );
}
