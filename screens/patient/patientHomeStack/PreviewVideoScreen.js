import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ActivityIndicator,
  Button,
  ProgressBar,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { createVideo } from "../../../store/redux/videoSlice";
import { addDocumentWithId } from "../../../util/firestoreWR";
import { VIDEO_STATUS } from "../../../constants/constants";
import { useTranslation } from "react-i18next";
import storage from "@react-native-firebase/storage";

function PreviewVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  // const storageRef = getStorage();
  const uid = useSelector((state) => state.authObject.user_uid);
  const videoRef = React.useRef(null);
  const dispatch = useDispatch();
  const { key, name, params, path } = route;
  const { t } = useTranslation("patient");

  const [video, setVideo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("upload_video_header_title"),
    });
    setVideo(params.uri);
    // console.log(video);
  }, [params, t]);

  const pickImage = async () => {
    //No permission when launching image library
    // setDialogVisible(true);
    setTimeout(() => setIsLoading(true), 1000);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // aspect: [4, 3],
      quality: 0.3,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
    setIsLoading(false);
  };

  //Upload video to firestore
  const handleVideoSubmit = async () => {
    try {
      setIsLoading(true);

      if (uid === null || uid === undefined || uid === "") {
        return Alert.alert(
          t("unauthorized_alert_title"),
          t("unauthorized_alert_message")
        );
      }

      if (video === null || video === undefined || video === "") {
        return Alert.alert(
          t("video_error_alert_title"),
          t("video_error_alert_message")
        );
      }

      const refStr =
        "patientTreatmentVideo/" + uid + new Date().toISOString().slice(0, 10);
      const reference = storage().ref(refStr);
      const task = reference.putFile(video);

      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Video upload is " + progress + "% done");
          setUploadProgress(progress.toFixed());
        },
        (error) => {
          setIsLoading(false);
          throw error;
        }
      );

      task.then(async () => {
        const downloadURL = await reference.getDownloadURL();
        reference
          .getMetadata()
          .then(async (metadata) => {
            addDocumentWithId("video", metadata.name, {
              medical_checklist: "",
              rejected_reason: null,
              reviewed_timestamp: null,
              reviewer_id: null,
              status: VIDEO_STATUS.PENDING,
              submitter_id: uid,
              uploaded_timestamp: new Date(),
              video_url: downloadURL,
            })
              .then(() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                Alert.alert(
                  t("success_alert_title"),
                  t("success_alert_message")
                );
                dispatch(
                  createVideo({
                    medical_checklist: "",
                    rejected_reason: null,
                    reviewed_timestamp: null,
                    reviewer_id: null,
                    status: VIDEO_STATUS.PENDING,
                    submitter_id: uid,
                    uploaded_timestamp: new Date().toISOString(),
                    video_url: downloadURL,
                  })
                );
                setIsLoading(false);
                navigation.popToTop();
              })
              .catch((error) => {
                throw error;
              });
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            console.log(
              `Error while getting metadata and writing to firestore: ${error}`
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(t("error_alert_title"), t("error_alert_message"));
          });
      });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      switch (error.code) {
        // User doesn't have permission to access the object
        case "storage/unauthorized":
          Alert.alert(
            t("unauthorized_alert_title"),
            t("unauthorized_alert_message")
          );
          break;

        // User canceled the upload
        case "storage/canceled":
          Alert.alert(t("cancelled_alert_title"), t("cancelled_alert_message"));
          break;

        // Unknown error occurred, inspect error.serverResponse
        default:
          Alert.alert(
            t("unknown_error_alert_title"),
            t("unknown_error_alert_message")
          );
          break;
      }
      setIsLoading(false);
      console.error("Error uploading video:", error);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
        flex: 1,
        position: "relative",
      }}
    >
      <View
        style={{
          height: "60%",
          marginTop: 16,
          aspectRatio: 9 / 16,
          alignSelf: "center",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: video }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
        {isLoading && ( // Show loading indicator only when isLoading is true
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator color={theme.colors.primary} size={48} />
          </View>
        )}
      </View>
      {isLoading ? (
        <View
          style={{
            marginTop: 16,
            marginBottom: 16,
            alignSelf: "center",
            width: "100%",
            height: 24,
          }}
        >
          <ProgressBar progress={uploadProgress} />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: "row-reverse",
          marginTop: 40,
          flexWrap: "wrap",
        }}
      >
        <Button
          mode="contained"
          onPress={handleVideoSubmit}
          style={{ marginLeft: 16, marginBottom: 16 }}
          disabled={isLoading ? true : false}
        >
          {t("upload_button_text")}
        </Button>
        <Button
          mode="contained-tonal"
          onPress={pickImage}
          style={{ marginBottom: 16 }}
          disabled={isLoading ? true : false}
        >
          {t("choose_another_video_button_text")}
        </Button>
      </View>
    </View>
  );
}

export default PreviewVideoScreen;

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
