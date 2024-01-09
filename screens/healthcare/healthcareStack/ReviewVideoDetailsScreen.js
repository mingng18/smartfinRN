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
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { TREATMENT, VIDEO_STATUS } from "../../../constants/constants";
import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { editDocument } from "../../../util/firestoreWR";
import { updateVideo } from "../../../store/redux/videoSlice";

export default function ReviewVideoDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentVideo = params.video;

  const videoRef = React.useRef(null);
  const storageRef = getStorage();
  const dispatch = useDispatch();

  //Treatment Drop down
  const [treatmentOpen, setTreatmentOpen] = React.useState(false);
  const [treatment, setTreatment] = React.useState("akurit4");
  const [treatmentData, setTreatmentData] = React.useState(TREATMENT);

  //Dialog
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Video",
    });
  });

  const handleVideoSubmission = async (isAccepted) => {
    const storedUid = await SecureStore.getItemAsync("uid");
    try {
      if (isAccepted) {
        const updatedVideo = {
          medical_checklist: treatment,
          rejected_reason: "",
          reviewed_timestamp: new Date(),
          reviewer_id: storedUid,
          status: VIDEO_STATUS.ACCEPTED,
          submitter_id: currentVideo.submitter_id,
          uploaded_timestamp: Timestamp.fromDate(
            new Date(currentVideo.uploaded_timestamp)
          ),
          video_url: "",
        };

        await editDocument("video", currentVideo.id, updatedVideo);

        // Delete the video file from firebase storage
        deleteVideo(currentVideo.id);

        // Dispatch the updateVideo action to update the Redux state
        dispatch(
          updateVideo({
            id: currentVideo.id,
            changes: {
              medical_checklist: treatment,
              rejected_reason: "",
              reviewed_timestamp: new Date().toISOString(),
              reviewer_id: storedUid,
              status: VIDEO_STATUS.ACCEPTED,
              submitter_id: currentVideo.submitter_id,
              uploaded_timestamp: currentVideo.uploaded_timestamp,
              video_url: "",
            },
          })
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Video successfully accepted.");
        navigation.goBack();
      } else {
        if (reason === "") {
          setReasonError(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert("Error occured", "Please fill in reason");
        } else {
          const updatedVideo = {
            medical_checklist: treatment,
            rejected_reason: reason,
            reviewed_timestamp: serverTimestamp(),
            reviewer_id: storedUid,
            status: VIDEO_STATUS.REJECTED,
            submitter_id: currentVideo.submitter_id,
            uploaded_timestamp: Timestamp.fromDate(
              new Date(currentVideo.uploaded_timestamp)
            ),
            video_url: "",
          };
          await editDocument("video", currentVideo.id, updatedVideo);

          // Delete the video file from firebase storage
          deleteVideo(currentVideo.id);

          // Dispatch the updateVideo action to update the Redux state
          dispatch(updateVideo({ id: currentVideo.id, changes: updatedVideo }));

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert("Success", "Video successfully rejected.");
          navigation.goBack();
        }
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error Occurred", `Please try again later ${error}`);
    }
  };

  function deleteVideo(vidId) {
    const videoRef = ref(storageRef, `patientTreatmentVideo/${vidId}`);

    deleteObject(videoRef)
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
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: currentVideo.video_url }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
        <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 8 }}>
          Medication Checklists
        </Text>
        <CustomDropDownPicker
          open={treatmentOpen}
          setOpen={setTreatmentOpen}
          value={treatment}
          setValue={setTreatment}
          items={treatmentData}
          setItems={setTreatmentData}
          placeholder="Treatment"
        />
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
            Accept
          </Button>
          <Button mode="contained-tonal" onPress={() => showDialog()}>
            Reject
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Video Rejected</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Please provide reasons</Text>
            <TextInput
              mode="outlined"
              style={{ marginTop: 8 }}
              placeholder="Type your reason here"
              value={reason}
              onChangeText={(text) => setReason(text)}
              maxLength={100}
              error={reasonError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={() => handleVideoSubmission(false)}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
