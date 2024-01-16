import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { BLANK_PROFILE_PIC, USER_TYPE } from "../../../constants/constants";
import { Timestamp } from "firebase/firestore";
import PersonalInfoForm from "../../../components/Auth/PersonalInfoForm";
import TreatmentInfoForm from "../../../components/Auth/TreatmentInfoForm";
import UploadProfilePicModal from "../../common/UploadProfilePicModal";
import { useSelector } from "react-redux";

function PatientEditProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);

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
      <ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Image
            source={{ uri: user.profile_pic_url }}
            cacheKey={`${user.profile_pic_url}-thumb`}
            defaultSource={BLANK_PROFILE_PIC}
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
          value={user.email}
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
        <PersonalInfoForm isEditing={true} />
        <View style={{ marginTop: 32 }} />
        <TreatmentInfoForm isEditing={true} />
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
      <UploadProfilePicModal
        bottomSheetModalRef={bottomSheetModalRef}
        userType={USER_TYPE.PATIENT}
      />
    </View>
  );
}

export default PatientEditProfileScreen;
