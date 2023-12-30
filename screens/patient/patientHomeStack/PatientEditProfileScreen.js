import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { BLANK_PROFILE_PIC } from "../../../constants/constants";
import { Timestamp } from "firebase/firestore";
import PersonalInfoForm from "../../../components/Auth/PersonalInfoForm";
import TreatmentInfoForm from "../../../components/Auth/TreatmentInfoForm";
import UploadProfilePicModal from "./UploadProfilePicModal";

function PatientEditProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  // modal ref
  const bottomSheetModalRef = useRef(null);

  // modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Profile",
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
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 16, alignItems: "center" }}>
          {/* TODO Change the patients image */}
          <Image
            source={require("../../../assets/blank-profile-pic.png")}
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
          <Button onPress={() => bottomSheetModalRef.current?.present()}>
            Change Profile Picture
          </Button>
        </View>
        {/* ====================== Sign In Info =================== */}
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          Sign In Info
        </Text>
        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Type your email"
          value={profileData.email}
          maxLength={100}
          style={{ marginTop: 16 }}
          disabled
        />
        <Text variant="bodySmall" style={{ marginTop: 4 }}>
          You cannot change your email, please contact developer
        </Text>
        <View style={{ flexDirection: "row-reverse", marginTop: 24 }}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          >
            Change Password
          </Button>
        </View>
        {/* ====================== Personal Information =================== */}
        <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 16 }}>
          Personal Information
        </Text>
        <PersonalInfoForm isEditing />
        <View style={{ marginTop: 32 }} />
        <TreatmentInfoForm isEditing />
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
      <UploadProfilePicModal bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
}

export default PatientEditProfileScreen;

const profileData = {
  age: 21,
  compliance_status: "Compliant",
  date_of_diagnosis: Timestamp.fromDate(new Date("2023-12-20")),
  diagnosis: "SPPTB",
  email: "hahahahah@gmail.com",
  first_name: "Arul",
  last_name: "Zaidi",
  gender: 0,
  nationality: "malaysian",
  notes: "this is notes",
  nric_passport: "0205124423132",
  number_of_tablets: "3",
  phone_number: "+60194645296",
  profile_pic_url: "",
  treatment: 0,
  treatment_duration_month: 3,
};
