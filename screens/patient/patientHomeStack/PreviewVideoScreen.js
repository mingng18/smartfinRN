import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { addDocumentWithId } from "../../../util/firestoreWR";
import { db } from "../../../util/firebaseConfig";

function PreviewVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const storageRef = getStorage();
  const uid = useSelector((state) => state.authObject.user_uid);
  const { key, name, params, path } = route;
  const [video, setVideo] = React.useState("");
  const videoRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Upload Video",
    });
    setVideo(params);
    console.log(video);
  });

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

  async function saveVideoDataToFirestore(documentType, videoId, videoUrl) {
    await setDoc(doc(db, documentType, videoId), {
      medical_checklist: "",
      rejected_reason: null,
      reviewed_timestamp: null,
      reviewer_id: null,
      status: "pending",
      submitter_id: uid,
      uploaded_timestamp: Timestamp.now(),
      video_url: videoUrl,
    });
  }

  //Upload video to firestore
  //TODO : more specific error handling
  const handleVideoSubmit = async () => {
    try {
      setIsLoading(true);
      const videoData = await fetch(video);
      const videoBlob = await videoData.blob();

      if (uid === null || uid === undefined || uid === "") {
        Alert.alert(
          "Error",
          "Something wrong, please login again and try again"
        );
        return;
      }
      const videoRef = ref(storageRef, "patientTreatmentVideo/" + uid + Timestamp.now().toDate().toISOString());

      uploadTask = uploadBytesResumable(videoRef, videoBlob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Video upload is " + progress + "% done");
          setUploadProgress(progress.toFixed(2));
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              Alert.alert(
                "Unauthorized",
                "Error uploading video, please login again and try again"
              );

              break;
            case "storage/canceled":
              // User canceled the upload
              Alert.alert("Cancelled", "Video upload cancelled");
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              Alert.alert("Error", "Error uploading video, please try again");
              break;
          }
          setIsLoading(false);
        },
        (snapshot) => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            getMetadata(videoRef)
              .then(async (metadata) => {
                await saveVideoDataToFirestore("video", metadata.name, downloadURL);
                navigation.navigate("PatientHomeScreen");
                // Metadata now contains the metadata for 'images/forest.jpg'
              })
              .catch((error) => {
                // Uh-oh, an error occurred!
                console.log("Error while getting metadata and writing to firestore: " + error);
                Alert.alert("Error", "Error uploading video, please try again");
              });
            setIsLoading(false);
            console.log("Video uploaded successfully!");
          });
        }
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Error uploading video, please try again");
      console.error("Error uploading video:", error);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
        flex: 1,
        position: "relative", // Position the container relative to its normal position
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
      <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
        <Button mode="contained" onPress={handleVideoSubmit}>
          Upload
        </Button>
        <Button
          mode="contained-tonal"
          style={{ marginRight: 16 }}
          onPress={pickImage}
        >
          Choose Another Video
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
