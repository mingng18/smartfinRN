import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import TreatmentInfoForm from "../../components/Auth/TreatmentInfoForm";

export default function TreatmentInfoScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Treatment Information",
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
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <TreatmentInfoForm />
      </ScrollView>
    </View>
  );
}
