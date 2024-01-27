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
    { label: "Medical Assistant", value: "medical_assistant" },
  ]);

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [category, setCategory] = React.useState("government_hospital");
  const [categoryData, setCategoryData] = React.useState([
    { label: "Government Hospital", value: "government_hospital" },
    { label: "Private Hospital", value: "private_hospital" },
    { label: "NGO", value: "ngo" },
  ]);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mpmId, setMpmId] = React.useState("");

  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    firstName: false,
    lastName: false,
    mpmId: false,
  });

  const user = useSelector((state) => state.authObject);
  const signupInfo = useSelector((state) => state.signupObject);

  React.useEffect(() => {
    console.log(signupInfo.signupMode)
    if (isEditing) {
      setCategory(user.category);
      setRole(user.role);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setMpmId(user.mpm_id);
    }
  }, [isEditing]);

  async function nextButtonHandler() {
    const inputValid = inputCheck();

    if (!inputValid) {
      return;
    }

    // Update redux store
    dispatch(
      updateHealthcareInformation({
        firstName: firstName,
        lastName: lastName,
        mpmId: mpmId,
        role: role,
        category: category,
      })
    );

    navigation.navigate("UploadProfilePicScreen");
  }

  async function updateButtonHandler() {
    const inputValid = inputCheck();

    if (!inputValid) {
      return;
    }

    //Update new data into firebase
    try {
      await editDocument(FIREBASE_COLLECTION.HEALTHCARE, user.user_uid, {
        first_name: firstName,
        last_name: lastName,
        role: role,
        mpm_id: mpmId,
        category: category,
      });

      dispatch(
        editHealthcareInfo({
          first_name: firstName,
          last_name: lastName,
          mpm_id: mpmId,
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
    const mpmIdRegex = /^[A-Za-z0-9]+$/;

    // Input validation logic
    const firstNameIsValid = nameRegex.test(firstName);
    const lastNameIsValid = nameRegex.test(lastName);
    const mpmIdIsValid = mpmIdRegex.test(mpmId);

    if (!firstNameIsValid || !lastNameIsValid || !mpmIdIsValid) {
      setCredentialsInvalid({
        firstName: !firstNameIsValid,
        lastName: !lastNameIsValid,
        mpmId: !mpmIdIsValid,
      });
      Alert.alert("Invalid input", "Please check your entered input.");
      return false;
    }
    return true
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
        zIndex={5000}
        zIndexInverse={3000}
        open={roleOpen}
        setOpen={setRoleOpen}
        value={role}
        setValue={setRole}
        items={roleData}
        setItems={setRoleData}
        placeholder="Role"
      />
      <View style={{ marginTop: 16 }} />
      <View style={{zIndex : -5}}>
        <TextInput
          mode="outlined"
          label="MPM ID"
          maxLength={10}
          value={mpmId}
          onChangeText={(value) => setMpmId(value)}
          error={credentialsInvalid.mpmId}
        />
      </View>
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        zIndex={4000}
        // zIndexInverse={2000}
        open={categoryOpen}
        setOpen={setCategoryOpen}
        value={category}
        setValue={setCategory}
        items={categoryData}
        setItems={setCategoryData}
        placeholder="Category"
      />

      <View
        style={{
          marginTop: 40,
          flexDirection: "row-reverse",
          marginBottom: 56,
        }}
      >
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
