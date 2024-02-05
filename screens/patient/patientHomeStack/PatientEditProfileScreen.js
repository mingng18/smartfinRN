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
import { useTranslation } from "react-i18next";

function PatientEditProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);
  const { t } = useTranslation("patient");

  // modal ref
  const bottomSheetModalRef = useRef(null);

  // modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("edit_profile_header_title"),
    });
  }, [t]);

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
          {user.profile_pic_url && user.profile_pic_url !== "" ? (
            <CachedImage
              source={{ uri: user.profile_pic_url }}
              cacheKey={`${getLastTenCharacters(user.profile_pic_url)}`}
              defaultSource={BLANK_PROFILE_PIC}
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
          ) : (
            <Image
              source={BLANK_PROFILE_PIC}
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
          )}
          <Button onPress={() => bottomSheetModalRef.current?.present()}>
            {t("change_profile_picture_text")}
          </Button>
        </View>
        {/* ====================== Sign In Info =================== */}
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          {t("sign_in_info_text")}
        </Text>
        <TextInput
          mode="outlined"
          label={t("email_label")}
          placeholder={t("type_email_placeholder")}
          value={user.email}
          maxLength={100}
          style={{ marginTop: 16 }}
          disabled
        />
        <Text variant="bodySmall" style={{ marginTop: 4 }}>
          {t("cannot_change_email_text")}
        </Text>
        <View style={{ flexDirection: "row-reverse", marginTop: 24 }}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          >
            {t("change_password_button_text")}
          </Button>
        </View>
        {/* ====================== Personal Information =================== */}
        <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 16 }}>
          {t("personal_information_text")}
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
