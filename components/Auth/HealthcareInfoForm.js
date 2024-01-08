import { Button, TextInput } from "react-native-paper";
import React from "react";
import { Alert, View } from "react-native";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import { useDispatch, useSelector } from "react-redux";
import { updateHealthcareInformation } from "../../store/redux/signupSlice";
import * as Haptics from "expo-haptics";
import { editDocument } from "../../util/firestoreWR";
import { useNavigation } from "@react-navigation/native";
import { editHealthcareInfo } from "../../store/redux/authSlice";
import { FIREBASE_COLLECTION } from "../../constants/constants";

export default function HealthcareInfoForm({ isEditing }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
  ]);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [staffId, setStaffId] = React.useState("");

  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    firstName: false,
    lastName: false,
    staffId: false,
  });

  const user = useSelector((state) => state.authObject);

  React.useEffect(() => {
    if (isEditing) {
      setCategory(user.category);
      setRole(user.role);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setStaffId(user.staff_id);
    }
  }, [isEditing]);

  async function nextButtonHandler() {
    inputCheck();
    // Update redux store
    dispatch(
      updateHealthcareInformation({
        firstName: firstName,
        lastName: lastName,
        staffId: staffId,
        role: role,
        category: category,
      })
    );

    navigation.navigate("UploadProfilePicScreen");
  }

  async function updateButtonHandler() {
    inputCheck();

    //Update new data into firebase
    try {
      await editDocument(FIREBASE_COLLECTION.HEALTHCARE, user.user_uid, {
        first_name: firstName,
        last_name: lastName,
        role: role,
        staff_id: staffId,
        category: category,
      });

      dispatch(
        editHealthcareInfo({
          first_name: firstName,
          last_name: lastName,
          staff_id: staffId,
          role: role,
          category: category,
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

  function inputCheck() {
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
  }

  return (
    <>
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
        open={roleOpen}
        setOpen={setRoleOpen}
        value={role}
        setValue={setRole}
        items={roleData}
        setItems={setRoleData}
        placeholder="Role"
      />
      <View style={{ marginTop: 16 }} />
      <TextInput
        mode="outlined"
        label="Staff ID"
        maxLength={10}
        value={staffId}
        onChangeText={(value) => setStaffId(value)}
        error={credentialsInvalid.staffId}
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
          onPress={
            isEditing ? () => updateButtonHandler() : () => nextButtonHandler()
          }
        >
          {isEditing ? "Update" : "Next"}
        </Button>
      </View>
    </>
  );
}
