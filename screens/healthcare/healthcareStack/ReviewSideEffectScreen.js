import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { SIDE_EFFECT_SEVERITY } from "../../../constants/constants";
import { useTranslation } from "react-i18next";

const ReviewSideEffectScreen = () => {
  const theme = useTheme();
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const navigation = useNavigation();
  const { t } = useTranslation("healthcare");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("side_effects_alert"),
    });
  });

  const sortedSideEffects = React.useMemo(() => {
    if (sideEffects.length > 0) {
      return [...sideEffects].sort((a, b) => {
        if (a.severity < b.severity) return 1;
        if (a.severity > b.severity) return -1;
        return 0;
      });
    } else {
      return [];
    }
  }, [sideEffects]);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {sideEffects.length > 0 ? (
          sortedSideEffects.map((sideEffect, i) => {
            return (
              <HorizontalCard
                key={`sideEffect-${i}`}
                cardType={"sideEffect"}
                profilePic={sideEffect.patient_profile_picture}
                subject={capitalizeFirstLetter(sideEffect.patient_first_name)}
                status={t(sideEffect.severity)}
                date={new Date(sideEffect.created_timestamp)
                  .toISOString()
                  .slice(0, 10)}
                time={new Date(sideEffect.created_timestamp).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
                color={
                  sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
                    ? theme.colors.surfaceContainer
                    : theme.colors.errorContainer
                }
                onPressedCallback={() => {
                  navigation.navigate("ReviewSideEffectDetailScreen", {
                    sideEffect: sideEffect,
                  });
                }}
              />
            );
          })
        ) : (
          <Text variant="bodyLarge">{t("all_side_effects_reviewed")}</Text>
        )}
        <View style={{ marginBottom: 56 }} />
      </ScrollView>
    </View>
  );
};

export default ReviewSideEffectScreen;
