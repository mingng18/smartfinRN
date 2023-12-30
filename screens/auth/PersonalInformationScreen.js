import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { updatePersonalInformation } from "../../store/redux/signupSlice";
import { useDispatch } from "react-redux";
import { GENDER, NATIONALITY } from "../../constants/constants";
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
