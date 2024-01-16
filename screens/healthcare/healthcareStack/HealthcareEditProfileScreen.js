import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import PersonalInfoForm from "../../../components/Auth/PersonalInfoForm";
import HealthcareInfoForm from "../../../components/Auth/HealthcareInfoForm";
import UploadProfilePicModal from "../../common/UploadProfilePicModal";
import { USER_TYPE } from "../../../constants/constants";

export default function HealthcareEditProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);

  // modal ref
  const bottomSheetModalRef = useRef(null);

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
            source={
              user.profile_pic_url
                ? { uri: user.profile_pic_url }
                : BLANK_PROFILE_PIC
            }
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
        <HealthcareInfoForm isEditing={true} />
        <View style={{ marginTop: 32 }} />
      </ScrollView>
      <UploadProfilePicModal
        bottomSheetModalRef={bottomSheetModalRef}
        userType={USER_TYPE.HEALTHCARE}
      />
    </View>
  );
}
