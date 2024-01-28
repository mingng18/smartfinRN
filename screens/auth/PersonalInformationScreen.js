import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Keyboard, View, TouchableWithoutFeedback } from "react-native";
import PersonalInfoForm from "../../components/Auth/PersonalInfoForm";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function PersonalInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation("auth");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("personal_info"),
    });
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <PersonalInfoForm isEditing={false} />
      </View>
    </TouchableWithoutFeedback>
  );
}
