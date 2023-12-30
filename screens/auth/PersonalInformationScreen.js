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
  const dispatch = useDispatch();
  const millennium = Math.floor(new Date().getFullYear() / 1000) * 1000;

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [genderOpen, setGenderOpen] = React.useState(false);
  const [gender, setGender] = React.useState(0);
  const [genderData, setGenderData] = React.useState([
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
  ]);

  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [nationalityOpen, setNationalityOpen] = React.useState(false);
  const [nationality, setNationality] = React.useState("Malaysian");
  const [nationalityData, setNationalityData] = React.useState([
    { label: "Malaysian", value: "Malaysian" },
    { label: "Indonesian", value: "Indonesian" },
  ]);

  const [nric, setNric] = React.useState("");
  const [passport, setPassport] = React.useState("");
  const [age, setAge] = React.useState("");
  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    nric: false,
    passport: false,
    age: false,
  });
  const [isAuthenticating, setIsAuthenticating] = React.useState();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Personal Information",
    });
  });

  function handlerForAgeInputChange(value) {
    setNric(value);
    if (nric !== null) {
      // Calculate age based on nric
      setAge(new Date().getFullYear() - value.slice(0, 2) - millennium);
    }
  }

  async function nextButtonHandler() {
    // Input validation logic
    const nameRegex = /^[A-Za-z ]+$/; //Only alphabets and spaces
    const phoneRegex = /^\+[0-9]{10,13}$/; //+60123456789
    const nricRegex = /^[0-9]{12}$/; //Without spacing and -
    const passportRegex = /^[A-Za-z]{1}\d{7}$/; //A1234567
    const ageRegex = /^\d{1,3}$/; //1-3 digits

    const isFirstNameValid = nameRegex.test(firstName);
    const isLastNameValid = nameRegex.test(lastName);
    const isPhoneNumberValid = phoneRegex.test(phoneNumber);
    const isNricValid = nricRegex.test(nric);
    const isPassportValid = passportRegex.test(passport);
    const isAgeValid = ageRegex.test(age);

    setCredentialsInvalid({
      firstName: !isFirstNameValid,
      lastName: !isLastNameValid,
      phoneNumber: !isPhoneNumberValid,
      nric: !isNricValid,
      passport: !isPassportValid,
      age: !isAgeValid,
    });

    // Debug use---------------------------------------------------------------
    console.log(
      "isFirstNameValid: " +
        isFirstNameValid +
        "\n" +
        "isLastNameValid: " +
        isLastNameValid +
        "\n" +
        "isPhoneNumberValid: " +
        isPhoneNumberValid +
        "\n" +
        "isNricValid: " +
        isNricValid +
        "\n" +
        "isPassportValid: " +
        isPassportValid +
        "\n" +
        "isAgeValid: " +
        isAgeValid +
        age
    );
    //Debug use---------------------------------------------------------------

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isPhoneNumberValid ||
      (!isNricValid && !isPassportValid) ||
      !isAgeValid
    ) {
      return Alert.alert(
        "Invalid input",
        "Please check your entered credentials."
      );
    }

    setIsAuthenticating(true);
    try {
      {
        nric
          ? dispatch(
              updatePersonalInformation({
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                phoneNumber: phoneNumber,
                nationality: nationality,
                nric_passport: nric,
                age: age,
              })
            )
          : dispatch(
              updatePersonalInformation({
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                phoneNumber: phoneNumber,
                nationality: nationality,
                nric_passport: passport,
                age: age,
              })
            );
      }
      navigation.navigate("UploadProfilePicScreen");
    } catch (error) {
      Alert.alert(
        "Something went wrong, please check your input and try again later."
      );
      console.log(error); //Debug use
    } finally {
      setIsAuthenticating(false);
    }
  }

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
