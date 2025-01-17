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
import {
  clearSignupSlice,
  updateProfilePictureURI,
} from "../../store/redux/signupSlice";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  setFirstTimeLogin,
  setUserType,
} from "../../store/redux/authSlice";
import { addDocumentWithId } from "../../util/firestoreWR";
import { useTranslation } from "react-i18next";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";

export default function UploadProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const signupInfo = useSelector((state) => state.signupObject);
  const localUser = useSelector((state) => state.authObject);

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
      profile_pic_url: "",
    });
  }

  async function uploadProfilePicAndWriteIntoDatabase(uid, userToken) {
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
      await saveUserDateToFirestore("healthcare", uid, "");
      dispatch(authenticateStoreNative(userToken, uid, "healthcare"));
      dispatch(fetchPatientCollectionData());
      dispatch(
        fetchAppointments({ userId: uid, userType: USER_TYPE.HEALTHCARE })
      );
      dispatch(fetchVideos({ userId: uid, userType: USER_TYPE.HEALTHCARE }));
      dispatch(
        fetchSideEffects({ userId: uid, userType: USER_TYPE.HEALTHCARE })
      );

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
    }
  }

  async function signupHealthcare() {
    setIsUploading(true);
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

    if (localUser.first_time_login) {
      try {
        console.log("first time login");
        console.log("token: " + localUser.token);
        console.log("uid: " + localUser.user_uid);

        uploadProfilePicAndWriteIntoDatabase(
          localUser.user_uid,
          localUser.token
        );
        dispatch(setFirstTimeLogin({ first_time_login: false }));
      } catch (error) {
        console.log("Sign up for first time login user failed: " + error);
      }
    } else {
      try {
        //Create user
        const userCredential = await auth().createUserWithEmailAndPassword(
          signupInfo.email,
          signupInfo.password
        );
        const user = userCredential.user;
        const token = await user.getIdToken();

        uploadProfilePicAndWriteIntoDatabase(user.uid, token);
      } catch (error) {
        Alert.alert(t("sign_up_failed"));
        console.log(error); //Debug use
        setIsUploading(false);
      }
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
