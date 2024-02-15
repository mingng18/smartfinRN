import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";

import {
  clearSignupSlice,
  updateProfilePictureURI,
} from "../../store/redux/signupSlice";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";

import {
  authenticateStoreNative,
  fetchHealthcareData,
  setFirstTimeLogin,
  setUserType,
} from "../../store/redux/authSlice";
import { addDocumentWithId } from "../../util/firestoreWR";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";
import { USER_TYPE } from "../../constants/constants";
import { useTranslation } from "react-i18next";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";

export default function PreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const dispatch = useDispatch();

  const signupMode = useSelector((state) => state.signupObject.signupMode);
  const signupInfo = useSelector((state) => state.signupObject);
  const localUser = useSelector((state) => state.authObject);
  const { t } = useTranslation("auth");

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("profile_picture"),
    });
    setUri(params.uri);
  });

  async function revertFailedSignup() {
    try {
      await auth().currentUser.delete();
      dispatch(setFirstTimeLogin({ first_time_login: false }));
      dispatch(authenticate({ isAuthenticated: false }));
      dispatch(logoutDeleteNative());
      dispatch(clearSignupSlice());
      console.log("Signup reverted");
    } catch (error) {
      console.log("Failed to revert signup");
    }
  }

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

  async function uploadImageAndWriteIntoDatabase(uri, path, userId, token) {
    try {
      setIsUploading(true);
      console.log("Uploading image to " + uri);
      console.log("User is  " + userId);

      imageData = await fetch(uri);
      imageBlob = await imageData.blob();
      uploadTask = await path.put(imageBlob);

      path.getDownloadURL().then(async (downloadURL) => {
        console.log("File available at ", downloadURL);
        dispatch(setUserType({ user_type: signupInfo.signupMode }));
        dispatch(
          fetchHealthcareData({
            category: signupInfo.category,
            email: signupInfo.email,
            first_name: signupInfo.firstName,
            last_name: signupInfo.lastName,
            role: signupInfo.role,
            mpm_Id: signupInfo.mpmId,
            profile_pic_url: downloadURL,
          })
        );

        dispatch(clearSignupSlice());
        await saveUserDateToFirestore("healthcare", userId, downloadURL);
        dispatch(authenticateStoreNative(token, userId, "healthcare"));
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
      });
    } catch (error) {
      setIsUploading(false);
      revertFailedSignup();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return Alert.alert(
        t("profile_picture_upload_failed"),
        t("try_again_later")
      );
    }
  }

  async function signupHealthcare() {
    dispatch(updateProfilePictureURI(uri));
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
        //Upload profile picture
        const ppStorageRef = storage().ref(
          "healthcareProfilePicture/" + localUser.user_uid
        );
        uploadImageAndWriteIntoDatabase(
          uri,
          ppStorageRef,
          localUser.user_uid,
          localUser.token
        );
        dispatch(setFirstTimeLogin({ first_time_login: false }));
        setIsUploading(false);
      } catch (error) {
        revertFailedSignup();
        Alert.alert(t("sign_up_failed"));
        console.log("Sign up for first time login user failed: " + error);
        setIsUploading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

        //Upload profile picture
        const ppStorageRef = storage().ref(
          "healthcareProfilePicture/" + user.uid
        );
        setIsUploading(true);
        const donwloadURL = await uploadImageAndWriteIntoDatabase(
          uri,
          ppStorageRef,
          user.uid,
          token
        );
        setIsUploading(false);
      } catch (error) {
        revertFailedSignup();
        Alert.alert(t("sign_up_failed"));
        console.log(error); //Debug use
        setIsUploading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }

  async function nextButtonHandler() {
    setIsUploading(true);

    try {
      dispatch(updateProfilePictureURI({ profilePictureURI: uri }));
    } catch (error) {
      return Alert.alert(t("upload_failed"));
    } finally {
      if (signupMode === USER_TYPE.PATIENT) {
        navigation.navigate("TreatmentInfoScreen");
        setIsUploading(false);
      } else {
        signupHealthcare();
      }
    }
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 40 }}>
        {t("preview")}
      </Text>
      <Image
        source={{ uri: uri }}
        style={{
          width: "50%",
          aspectRatio: 1,
          borderRadius: 800 / 2,
          alignSelf: "center",
        }}
      />
      {isUploading && ( // Show loading indicator only when isLoading is true
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator color={theme.colors.primary} size={48} />
        </View>
      )}
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => {
            nextButtonHandler();
          }}
          style={{ marginLeft: 16 }}
        >
          {signupMode === "patient" ? t("next_button") : t("sign_up_button")}
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.goBack();
          }}
        >
          {t("back")}
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

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    height: "100%",
    aspectRatio: 9 / 16,
  },
  activityIndicatorContainer: {
    ...StyleSheet.absoluteFillObject, // Position the container absolutely to cover the entire video area
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for the loading overlay
  },
});
