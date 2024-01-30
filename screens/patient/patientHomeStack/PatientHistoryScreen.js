import { KeyboardAvoidingView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import TextListButton from "../../../components/ui/TextListButton";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function PatientHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("history_header_title"),
    });
  },[t]);

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      ></View>
    </KeyboardAvoidingView>
  );
}
