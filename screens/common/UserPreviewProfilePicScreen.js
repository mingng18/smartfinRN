import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { editDocument } from "../../util/firestoreWR";
import { FIREBASE_COLLECTION, USER_TYPE } from "../../constants/constants";
import { updateProfilePic } from "../../store/redux/authSlice";
import * as Haptics from "expo-haptics";
import { CacheManager } from "expo-cached-image";
import { getLastTenCharacters } from "../../util/wordUtil";
import { useTranslation } from "react-i18next";
import storage from "@react-native-firebase/storage";

export default function UserPreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const user = useSelector((state) => state.authObject);
  // const storage = getStorage();
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState(params?.uri || "");
  const [userType, setUserType] = React.useState(params?.userType || "");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("profile_picture"),
    });
  }, [t]);

  async function uploadImage(uri) {
    console.log("user is : " + user.user_uid);
    const storageStr =
      userType === USER_TYPE.PATIENT
        ? "patientProfilePicture/"
        : "healthcareProfilePicture/";
    const ppStorageRef = storage().ref(storageStr + user.user_uid);
    // const ppStorageRef = ref(storage, storageStr + user.user_uid);

    try {
      if (uri == "" || uri == null) {
        return Alert.alert(t("no_image_selected"), t("select_an_image"));
      }

      // const imageData = await fetch(uri);
      // const imageBlob = await imageData.blob();

      // Compress the image
      // const compressedImage = await compressImage(imageBlob);
      const uploadTask = ppStorageRef.putFile(uri);
      // uploadTask = uploadBytesResumable(ppStorageRef, imageBlob);
      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress.toFixed(2));
      });
      uploadTask.then(() => {
        storage()
          .ref(storageStr + user.user_uid)
          .getDownloadURL()
          .then(async (downloadURL) => {
            // getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at ", downloadURL);

            //Add url to patient or healthcare docs
            await editDocument(
              userType === USER_TYPE.PATIENT
                ? FIREBASE_COLLECTION.PATIENT
                : FIREBASE_COLLECTION.HEALTHCARE,
              user.user_uid,
              {
                profile_pic_url: downloadURL,
              }
            );

            dispatch(updateProfilePic({ profile_pic_url: downloadURL }));
            //Update cached image
            await CacheManager.downloadAsync({
              uri: downloadURL,
              key: getLastTenCharacters(downloadURL),
            });

            setIsUploading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t("profile_pic_updated"));
            navigation.goBack();
          });
      });
    } catch (error) {
      setIsUploading(false);
      console.log("Update profile pic failed: " + error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return Alert.alert(
        t("update_profile_picture_failed"),
        t("try_again_later")
      );
    }
  }

  async function updateButtonHandler() {
    setIsUploading(true);
    await uploadImage(uri);
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
        {t("preview_profile_picture")}
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
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => {
            updateButtonHandler();
          }}
          style={{ marginLeft: 16 }}
        >
          {t("update")}
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
    </View>
  );
}
