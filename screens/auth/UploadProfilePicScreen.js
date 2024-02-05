import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";


import { BLANK_PROFILE_PIC, USER_TYPE } from "../../constants/constants";
import { clearSignupSlice, updateProfilePictureURI } from "../../store/redux/signupSlice";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  setUserType,
} from "../../store/redux/authSlice";
import { addDocumentWithId } from "../../util/firestoreWR";
import { useTranslation } from "react-i18next";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";

export default function UploadProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const signupInfo = useSelector((state) => state.signupObject);

  const dispatch = useDispatch();

  const { t } = useTranslation("auth");

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("profile_picture"),
    });
  });

  async function saveUserDateToFirestore(userType, userId, profilePicUrl) {
    await addDocumentWithId(userType, userId, {
      email: signupInfo.email,
      first_name: signupInfo.firstName,
      last_name: signupInfo.lastName,
      category: signupInfo.category,
      role: signupInfo.role,
      mpm_id: signupInfo.mpmId,
      profile_pic_url: profilePicUrl,
    });
  }

  async function uploadImage(path, userId, token) {
    setIsUploading(true);
    try {
      dispatch(setUserType({ user_type: signupInfo.signupMode }));
        dispatch(
          fetchHealthcareData({
            category: signupInfo.category,
            email: signupInfo.email,
            first_name: signupInfo.firstName,
            last_name: signupInfo.lastName,
            role: signupInfo.role,
            mpm_Id: signupInfo.mpmId,
            profile_pic_url: "",
          })
        );

        dispatch(clearSignupSlice());
        await saveUserDateToFirestore("healthcare", userId, "");
        dispatch(authenticateStoreNative(token, userId, "healthcare"));


        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setIsUploading(false);
        Alert.alert(
          t("sign_up_successful"),
          t("thanks_for_signing_up"),
          [
            {
              text: "OK",
              onPress: () => {},
              style: "cancel",
            },
          ],
          {
            cancelable: false,
          }
        );
      
    } catch (error) {
      console.log(error + "Error uploading image at uploadProfilePicScreen");
      setIsUploading(false);
    }
  }

  async function signupHealthcare() {
    dispatch(updateProfilePictureURI(""));
    //Debug use
    console.log(
      "email: " + signupInfo.email,
      "password: " + signupInfo.password,
      "first_name: " + signupInfo.firstName,
      "last_name: " + signupInfo.lastName,
      "category: " + signupInfo.category,
      "role: " + signupInfo.role,
      "staff_id: " + signupInfo.staffId,
      "profile_pic_url: " + signupInfo.profilePictureURI
    );

    try {
      //Create user
      const userCredential = await auth().createUserWithEmailAndPassword(
        signupInfo.email,
        signupInfo.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      //Upload profile picture
      const ppStorageRef = storage().ref(
        "healthcareProfilePicture/" + user.uid
      );

      setIsUploading(true);

      const donwloadURL = await uploadImage(
        ppStorageRef,
        user.uid,
        token
      );
      setIsUploading(false);
    } catch (error) {
      Alert.alert(t("sign_up_failed"));
      console.log(error); //Debug use
      setIsUploading(false);
    }
  }

  const skipProfilePictureHandler = () => {
    console.log("signupMode: " + signupInfo.signupMode);
    if (signupInfo.signupMode === USER_TYPE.HEALTHCARE) {
      signupHealthcare();
    } else {
      navigation.navigate("TreatmentInfoScreen");
    }
  };

  const pickImage = async () => {
    //No permission when launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      navigation.navigate("PreviewProfilePicScreen", {
        uri: uri,
      });
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 40 }}>
        {t("upload_profile_pic")}
      </Text>
      <Image
        source={BLANK_PROFILE_PIC}
        style={{
          borderRadius: 800 / 2,
          alignSelf: "center",
          paddingVertical: 16,
        }}
      />

      <View
        style={{
          marginTop: 40,
          flexDirection: "row-reverse",
          flexWrap: "wrap",
        }}
      >
        <Button
          mode="contained"
          onPress={pickImage}
          style={{ marginLeft: 16, marginBottom: 16 }}
        >
          {t("upload_button")}
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.navigate("CameraScreen", { isEditing: false });
          }}
          style={{ marginLeft: 16, marginBottom: 16 }}
        >
          {t("take_pic")}
        </Button>
        <Button
          style={{ marginBottom: 16 }}
          onPress={() => skipProfilePictureHandler()}
        >
          {t("skip")}
        </Button>
      </View>
      <LoadingIndicatorDialog
        visible={isUploading}
        close={() => {
          setIsUploading(false);
        }}
        title={t("signing_up")}
        bodyText={t("wait_patiently")}
      />
    </View>
  );
}
