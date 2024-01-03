import { useNavigation, useTheme } from "@react-navigation/native";
import React from "react";
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import PersonalInfoForm from "../../components/Auth/PersonalInfoForm";

export default function PersonalInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Personal Information",
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
