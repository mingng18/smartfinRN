import { KeyboardAvoidingView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import TextListButton from "../../../components/ui/TextListButton";
import { useNavigation } from "@react-navigation/native";

export default function PatientSettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Settings",
    });
  });

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
          text={"Reminder"}
          onPressCallback={() => {
            navigation.navigate("ReminderScreen");
          }}
        />
        <TextListButton
          text={"Language"}
          onPressCallback={() => {
            navigation.navigate("LanguageScreen");
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
