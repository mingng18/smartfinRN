import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import HealthcareInfoForm from "../../components/Auth/HealthcareInfoForm";

export default function HealthcareInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Healthcare Details",
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
