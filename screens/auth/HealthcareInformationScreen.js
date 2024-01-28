import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import HealthcareInfoForm from "../../components/Auth/HealthcareInfoForm";
import { useTranslation } from "react-i18next";

export default function HealthcareInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation("auth");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("healthcare_details"),
    });
  });

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <HealthcareInfoForm isEditing={false} />
    </View>
  );
}
