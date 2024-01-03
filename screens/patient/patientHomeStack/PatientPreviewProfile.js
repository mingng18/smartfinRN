import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import {
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export default function PatientPreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState("");

  //TODO Update profile picture
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Picture",
    });
    setUri(params.uri);
  });

  async function uploadImage(uri, path, userId) {
    console.log("Uploading image to " + uri);
    console.log("User is  " + userId);
    const imageData = await fetch(uri);
    const imageBlob = await imageData.blob();

    // Compress the image
    // const compressedImage = await compressImage(imageBlob);
    uploadTask = uploadBytesResumable(path, imageBlob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress.toFixed(2));
      },
      (error) => {},
      (snapshot) => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at ", downloadURL);
          await saveUserDateToFirestore("healthcare", userId, downloadURL);
        });
      }
    );
  }

  async function updateButtonHandler() {
    setIsUploading(true);
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
        Preview profile picture
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
          Update
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Back
        </Button>
      </View>
    </View>
  );
}
