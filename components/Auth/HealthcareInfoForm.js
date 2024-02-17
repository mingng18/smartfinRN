import React from "react";
import * as Haptics from "expo-haptics";
import { Alert, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import { updateHealthcareInformation } from "../../store/redux/signupSlice";
import { editDocument } from "../../util/firestoreWR";
import { editHealthcareInfo } from "../../store/redux/authSlice";
import { FIREBASE_COLLECTION } from "../../constants/constants";

export default function HealthcareInfoForm({ isEditing }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation("auth");
  const user = useSelector((state) => state.authObject);
  const signupInfo = useSelector((state) => state.signupObject);

  //Role data dropdownbox
  const [roleOpen, setRoleOpen] = React.useState(false);
  const [role, setRole] = React.useState("doctor");
  const [roleData, setRoleData] = React.useState([
    { label: t("doctor"), value: "doctor" },
    { label: t("nurse"), value: "nurse" },
    { label: t("medical_assistant"), value: "medical_assistant" },
  ]);

  //Category dropdown box
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [category, setCategory] = React.useState("government_hospital");
  const [categoryData, setCategoryData] = React.useState([
    { label: t("government_hospital"), value: "government_hospital" },
    { label: t("private_hospital"), value: "private_hospital" },
    { label: t("ngo"), value: "ngo" },
  ]);

  //Other Input data
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mpmId, setMpmId] = React.useState("");
  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    firstName: false,
    lastName: false,
    mpmId: false,
  });

  //If the patient is editing, populate the data into textinput
  React.useEffect(() => {
    console.log(signupInfo.signupMode);
    if (isEditing) {
      setCategory(user.category);
      setRole(user.role);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setMpmId(user.mpm_id);
    }
  }, [isEditing]);

  //Next button during sign up stage
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

  //Update button in edit page
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
      Alert.alert(t("update_success"), t("update_success_message"));
      navigation.goBack();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t("update_failed"), t("update_failed_message"));
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
      Alert.alert(t("invalid_input"), t("check_entered_details"));
      return false;
    }
    return true;
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
          label={t("first_name_label")}
          placeholder={t("first_name_placeholder")}
          maxLength={100}
          value={firstName}
          onChangeText={(value) => setFirstName(value)}
          error={credentialsInvalid.firstName}
        />
        <TextInput
          mode="outlined"
          style={{ flex: 1, marginLeft: 16 }}
          label={t("last_name_label")}
          placeholder={t("last_name_placeholder")}
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
        placeholder={t("role_placeholder")}
        listMode="SCROLLVIEW"
      />
      <View style={{ marginTop: 16 }} />
      <View style={{ zIndex: -5 }}>
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
        open={categoryOpen}
        setOpen={setCategoryOpen}
        value={category}
        setValue={setCategory}
        items={categoryData}
        setItems={setCategoryData}
        placeholder={t("category")}
        listMode="SCROLLVIEW"
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
          {isEditing ? t("update_button") : t("next_button")}
        </Button>
      </View>
    </>
  );
}
