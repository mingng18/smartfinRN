import { KeyboardAvoidingView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import TextListButton from "../../../components/ui/TextListButton";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function PatientSettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("settings_header_title"),
    });
  }, [t]);

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      >
        <TextListButton
          text={t("reminder_button_text")}
          onPressCallback={() => {
            navigation.navigate("ReminderScreen");
          }}
        />
        <TextListButton
          text={t("language_button_text")}
          onPressCallback={() => {
            navigation.navigate("LanguageScreen");
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
