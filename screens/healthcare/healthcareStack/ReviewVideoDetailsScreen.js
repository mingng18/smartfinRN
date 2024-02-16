import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { ResizeMode, Video } from "expo-av";
import { Alert, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { TREATMENT, VIDEO_STATUS } from "../../../constants/constants";
import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { editDocument } from "../../../util/firestoreWR";
import { deleteVideo } from "../../../store/redux/videoSlice";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";
import { useTranslation } from "react-i18next";
import storage from "@react-native-firebase/storage";

export default function ReviewVideoDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentVideo = params.video;
  const { t } = useTranslation("healthcare");

  const videoRef = React.useRef(null);
  // const storageRef = getStorage();
  const dispatch = useDispatch();

  //Dialog
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("video_header"),
    });
  });

  const handleVideoSubmission = async (isAccepted) => {
    setIsLoading(true);
    const storedUid = await SecureStore.getItemAsync("uid");
    try {
      if (isAccepted) {
        const updatedVideo = {
          medical_checklist: currentVideo.treatment,
          rejected_reason: "",
          reviewed_timestamp: new Date(),
          reviewer_id: storedUid,
          status: VIDEO_STATUS.ACCEPTED,
          submitter_id: currentVideo.submitter_id,
          uploaded_timestamp: new Date(currentVideo.uploaded_timestamp),
          video_url: "",
        };

        await editDocument("video", currentVideo.id, updatedVideo);

        // Delete the video file from firebase storage
        deleteVideoFromFirestore(currentVideo.id);

        // Dispatch the updateVideo action to update the Redux state
        dispatch(deleteVideo({ id: currentVideo.id }));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsLoading(false);
        Alert.alert(t("success"), t("video_accepted"));
        navigation.goBack();
      } else {
        if (reason === "") {
          setReasonError(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setIsLoading(false);
          Alert.alert("Error occured", "Please fill in reason");
        } else {
          const updatedVideo = {
            medical_checklist: currentVideo.treatment,
            rejected_reason: reason,
            reviewed_timestamp: new Date(),
            reviewer_id: storedUid,
            status: VIDEO_STATUS.REJECTED,
            submitter_id: currentVideo.submitter_id,
            uploaded_timestamp: new Date(currentVideo.uploaded_timestamp),
            video_url: "",
          };
          await editDocument("video", currentVideo.id, updatedVideo);

          // Delete the video file from firebase storage
          deleteVideoFromFirestore(currentVideo.id);

          // Dispatch the updateVideo action to update the Redux state
          dispatch(deleteVideo({ id: currentVideo.id }));

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setIsLoading(false);
          Alert.alert(t("success"), t("video_rejected"));
          navigation.goBack();
        }
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoading(false);
      Alert.alert(t("error_occurred"), t("try_again_later"));
    }
  };

  function deleteVideoFromFirestore(vidId) {
    const reference = storage().ref(`patientTreatmentVideo/${vidId}`);
    reference
      .delete()
      .then(() => console.log("Delete Video success"))
      .catch((error) => {
        throw error;
      });
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <HorizontalCard
          cardType={"video"}
          profilePic={currentVideo.patient_profile_picture}
          subject={capitalizeFirstLetter(currentVideo.patient_first_name)}
          status=""
          date={new Date(currentVideo.uploaded_timestamp)
            .toISOString()
            .slice(0, 10)}
          time={new Date(currentVideo.uploaded_timestamp).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }
          )}
          color={theme.colors.surfaceContainer}
        />
        {currentVideo.video_url && (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: currentVideo.video_url }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
          />
        )}
        <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 8 }}>
          {t("medication_checklists")}
        </Text>
        <Text variant="bodyLarge">
          {
            TREATMENT.find(
              (treatment) => treatment.value === currentVideo.patient_treatment
            ).label
          }
        </Text>
        <View
          style={{
            marginTop: 40,
            flexDirection: "row-reverse",
            marginBottom: 56,
          }}
        >
          <Button
            mode="contained"
            onPress={() => handleVideoSubmission(true)}
            style={{ marginLeft: 16 }}
          >
            {t("accept")}
          </Button>
          <Button mode="contained-tonal" onPress={() => showDialog()}>
            {t("reject")}
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{t("video_rejected_title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t("provide_reasons")}</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={10}
              style={{ marginTop: 8, paddingTop: 16 }}
              placeholder={t("type_reason_here")}
              value={reason}
              onChangeText={(text) => setReason(text)}
              maxLength={100}
              error={reasonError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>{t("cancel")}</Button>
            <Button onPress={() => handleVideoSubmission(false)}>
              {t("submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <LoadingIndicatorDialog
        visible={isLoading}
        close={() => {
          setIsLoading(false);
        }}
        title={t("reviewing_video_title")}
        bodyText={t("please_wait")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    borderRadius: 8,
    alignSelf: "center",
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "black",
  },
});
