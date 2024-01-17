import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from "react-native";
import {
  Button,
  Modal,
  Portal,
  Searchbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import { updatePersonalInformation } from "../../store/redux/signupSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FIREBASE_COLLECTION,
  GENDER,
  NATIONALITY,
  USER_TYPE,
} from "../../constants/constants";
import { fetchPatientData } from "../../store/redux/authSlice";
import { editDocument } from "../../util/firestoreWR";
import countryList from "../../assets/data/countryList.json";
import * as Haptics from "expo-haptics";
import { ScrollView } from "react-native-gesture-handler";

export default function PersonalInfoForm({ isEditing }) {
  //TODO handle update personal info case
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authObject);
  const millennium = Math.floor(new Date().getFullYear() / 1000) * 1000;

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [genderOpen, setGenderOpen] = React.useState(false);
  const [gender, setGender] = React.useState("male");
  const [genderData, setGenderData] = React.useState(GENDER);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [countryCode, setCountryCode] = React.useState(
    countryList.find((country) => country.name === "Malaysia")
  );

  const [nationalityOpen, setNationalityOpen] = React.useState(false);
  const [nationality, setNationality] = React.useState("Malaysian");
  const [nationalityData, setNationalityData] = React.useState(NATIONALITY);

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

  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setSearchQuery("");
  };

  const filteredCountryList = countryList.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Personal Information",
    });
  });

  React.useEffect(() => {
    if (isEditing) {
      //Personal Info
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setGender(user.gender);
      setPhoneNumber(user.phone_number);
      setNationality(user.nationality);
      setNric(user.nric_passport);
      setPassport(user.nric_passport);
      setAge(user.age);
    }
  }, [isEditing]);


  //Calculate the age based on nric, triggered when nric is changed
  function handlerForAgeInputChange(value) {
    setNric(value);

    if (nric !== null) {
      const currentYear = new Date().getFullYear();

      if (value.slice(0, 2) > currentYear % 100) {
        setAge(currentYear - (1900 + parseInt(value.slice(0, 2))));
      } else {
        setAge(currentYear - (2000 + parseInt(value.slice(0, 2))));
      }
    }
  }
  
  //Update personal info, triggered when update button is pressed in profile page
  async function updateButtonHandler() {

    const countryCodePhoneNumber = countryCode.iso + phoneNumber;
    if (user.user_type == USER_TYPE.PATIENT) {
      try {
        await editDocument(FIREBASE_COLLECTION.PATIENT, user.user_uid, {
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          phone_number: countryCodePhoneNumber,
          nationality: nationality,
          nric_passport: nric,
        });
        dispatch(
          fetchPatientData({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            phone_number: countryCodePhoneNumber,
            nationality: nationality,
            nric_passport: nric,
            age: user.age,
            compliance_status: user.compliance_status,
            date_of_diagnosis: user.date_of_diagnosis,
            diagnosis: user.diagnosis,
            email: user.email,
            notes: user.notes,
            number_of_tablets: user.number_of_tablets,
            treatment: user.treatment,
            treatment_duration_months: user.treatment_duration_months,
            profile_pic_url: user.profile_pic_url,
          })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Update successful", "Your information has been updated.");
        navigation.goBack();
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Update failed", "Something went wrong, please try again.");
        console.log(error);
      }
    }
  }

  //Next button handler, triggered when next button is pressed in signup page, will be substituted by update button handler in profile page
  async function nextButtonHandler() {
    const countryCodePhoneNumber = countryCode.iso + phoneNumber;
    console.log(countryCodePhoneNumber + " checking here")
    // Input validation logic
    const nameRegex = /^[A-Za-z ]+$/; //Only alphabets and spaces
    const phoneRegex = /^\+[0-9]{11,15}$/; //+60123456789
    const nricRegex = /^[0-9]{12}$/; //Without spacing and -
    const passportRegex = /^[A-Za-z]{1}\d{7}$/; //A1234567
    const ageRegex = /^\d{1,3}$/; //1-3 digits

    const isFirstNameValid = nameRegex.test(firstName);
    const isLastNameValid = nameRegex.test(lastName);
    const isPhoneNumberValid = phoneRegex.test(countryCodePhoneNumber);
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

    //client side input validation, if any of the input is invalid, return an alert
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
                phoneNumber: countryCodePhoneNumber,
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
                phoneNumber: countryCodePhoneNumber,
                nationality: nationality,
                nric_passport: passport,
                age: age,
              })
            );
      }
      setIsAuthenticating(false);
      navigation.navigate("UploadProfilePicScreen");
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert(
        "Something went wrong, please check your input and try again later."
      );
      console.log(error); //Debug use
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 16,
          }}
        >
          <TextInput
            mode="outlined"
            style={{ flex: 1 }}
            label="First Name"
            placeholder="Muhammad Ali"
            maxLength={100}
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
            error={credentialsInvalid.firstName}
          />
          <TextInput
            mode="outlined"
            style={{ flex: 1, marginLeft: 16 }}
            label="Last Name"
            placeholder="Mohammad Abu"
            maxLength={100}
            value={lastName}
            onChangeText={(value) => setLastName(value)}
            error={credentialsInvalid.lastName}
          />
        </View>
        <CustomDropDownPicker
          open={genderOpen}
          setOpen={setGenderOpen}
          value={gender}
          setValue={setGender}
          items={genderData}
          setItems={setGenderData}
          placeholder="Gender"
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 16,
          }}
        >
          <Pressable
            style={{
              paddingHorizontal: 12,
              justifyContent: "center",
              marginTop: 6,
              marginRight: 8,
              borderRadius: 4,
            }}
            onPress={showModal}
          >
            <Text variant="bodyLarge">{`${countryCode.emoji} ${countryCode.iso}`}</Text>
          </Pressable>
          <TextInput
            mode="outlined"
            style={{ flex: 3 }}
            label="Mobile Phone Number"
            maxLength={13}
            placeholder="+60123456789"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            error={credentialsInvalid.phoneNumber}
            keyboardType="numeric"
          />
        </View>
        <CustomDropDownPicker
          open={nationalityOpen}
          setOpen={setNationalityOpen}
          value={nationality}
          setValue={setNationality}
          items={nationalityData}
          setItems={setNationalityData}
          placeholder="Nationality"
        />
        {nationality == "Malaysian" ? (
          <TextInput
            mode="outlined"
            style={{ marginTop: 16 }}
            label="NRIC"
            placeholder="Type without spacing and -"
            maxLength={12}
            keyboardType="numeric"
            value={nric}
            onChangeText={(value) => handlerForAgeInputChange(value)}
            error={credentialsInvalid.nric}
          />
        ) : (
          <TextInput
            mode="outlined"
            style={{ marginTop: 16 }}
            label="Passport Number"
            maxLength={12}
            value={passport}
            onChangeText={(value) => setPassport(value)}
            error={credentialsInvalid.passport}
          />
        )}
        <TextInput
          mode="outlined"
          style={{ marginTop: 16 }}
          label="Age"
          keyboardType="numeric"
          maxLength={3}
          value={`${age}`}
          onChangeText={(value) => setAge(value)}
          error={credentialsInvalid.age}
        />

        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button
            mode="contained"
            onPress={
              isEditing
                ? () => updateButtonHandler()
                : () => nextButtonHandler()
            }
          >
            {isEditing ? "Update" : "Next"}
          </Button>
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: "white",
              paddingLeft: 24,
              paddingVertical: 40,
              margin: 16,
              borderRadius: 16,
              height: "80%",
            }}
          >
            <Text variant="titleLarge">Pick your country</Text>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{ marginVertical: 16, marginRight: 24 }}
            />
            <ScrollView>
              {filteredCountryList.map((country, i) => {
                return (
                  <Pressable
                    key={i}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 8,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onPress={() => {
                      setVisible(false);
                      setSearchQuery("");
                      setCountryCode(country);
                      // setPhoneNumber(country.iso);
                    }}
                  >
                    <Text variant="titleLarge" style={{ paddingRight: 16 }}>
                      {country.emoji}
                    </Text>
                    <Text variant="bodyMedium" style={{ flexGrow: 1 }}>
                      {country.name}
                    </Text>
                    <Text variant="bodyLarge">{country.iso}</Text>
                    <View style={{ marginRight: 24 }} />
                  </Pressable>
                );
              })}
            </ScrollView>
          </Modal>
        </Portal>
      </View>
    </TouchableWithoutFeedback>
  );
}
