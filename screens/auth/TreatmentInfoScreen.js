import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import React from "react";
import { Keyboard, View } from "react-native";

import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import TreatmentInfoForm from "../../components/Auth/TreatmentInfoForm";
import { useTranslation } from "react-i18next";

export default function TreatmentInfoScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const { t } = useTranslation("auth");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("treatment_info"),
    });
  });

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 16 }}
    >
      <TreatmentInfoForm />
    </ScrollView>
  );
}
