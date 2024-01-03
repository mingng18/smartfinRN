import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch } from "react-redux";
import { updateHealthcareInformation } from "../../store/redux/signupSlice";

export default function HealthcareInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [roleOpen, setRoleOpen] = React.useState(false);
  const [role, setRole] = React.useState("doctor");
  const [roleData, setRoleData] = React.useState([
    { label: "Doctor", value: "doctor" },
    { label: "Nurse", value: "nurse" },
  ]);

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [category, setCategory] = React.useState("government_hospital");
  const [categoryData, setCategoryData] = React.useState([
    { label: "Government hospital", value: "government_hospital" },
    { label: "Private Hospital", value: "private_hospital" },
    { label: "NGO", value: "ngo" },
    // Add more category options as needed
  ]);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [staffId, setStaffId] = React.useState("");

  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    firstName: false,
    lastName: false,
    staffId: false,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Healthcare Details",
    });
  });

  async function nextButtonHandler() {
    // Input validation using regex
    const nameRegex = /^[A-Za-z\s]+$/;
    const staffIdRegex = /^[A-Za-z0-9]+$/;

    // Input validation logic
    const firstNameIsValid = nameRegex.test(firstName);
    const lastNameIsValid = nameRegex.test(lastName);
    const staffIdIsValid = staffIdRegex.test(staffId);

    if (!firstNameIsValid || !lastNameIsValid || !staffIdIsValid) {
      setCredentialsInvalid({
        firstName: !firstNameIsValid,
        lastName: !lastNameIsValid,
        staffId: !staffIdIsValid,
      });
      return Alert.alert("Invalid input", "Please check your entered input.");
    }

    // Update redux store
    dispatch(
      
    );

    navigation.navigate("UploadProfilePicScreen");
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
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
          value = {firstName}
          onChangeText = {(value) => setFirstName(value)}
          error={credentialsInvalid.firstName}
        />
        <TextInput
          mode="outlined"
          style={{ flex: 1, marginLeft: 16 }}
          label="Last Name"
          placeholder="Mohammad Abu"
          maxLength={100}
          value = {lastName}
          onChangeText = {(value) => setLastName(value)}
          error={credentialsInvalid.lastName}
        />
      </View>
      <TextInput
        mode="outlined"
        label="Staff ID"
        maxLength={10}
        value = {staffId}
        onChangeText = {(value) => setStaffId(value)}
        error={credentialsInvalid.staffId}
      />
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        open={roleOpen}
        setOpen={setRoleOpen}
        value={role}
        setValue={setRole}
        items={roleData}
        setItems={setRoleData}
        placeholder="Role"
      />
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        open={categoryOpen}
        setOpen={setCategoryOpen}
        value={category}
        setValue={setCategory}
        items={categoryData}
        setItems={setCategoryData}
        placeholder="Category"
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => nextButtonHandler()}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
