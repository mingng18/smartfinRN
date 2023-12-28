import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePictureURI } from "../../store/redux/signupSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

export default function PreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const dispatch = useDispatch();
  const signupEmail = useSelector((state) => state.signupObject.email);

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState("");
  const storage = getStorage();
  const ppStorageRef = ref(storage, "profilePicture/" + signupEmail);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Picture",
    });
    setUri(params);
  });

  async function uploadImage(uri, fileType) {
    const imageData = await fetch(uri);
    const imageBlob = await imageData.blob();

    uploadTask = uploadBytesResumable(ppStorageRef, imageBlob);
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
          setUri(downloadURL);
        });
      }
    );
  }

  async function nextButtonHandler() {
    setIsUploading(true);

    try {
      dispatch(updateProfilePictureURI({ profilePictureURI: uri }));
    } catch (error) {
      return Alert.alert("Upload failed, please try again later.");
    } finally {
      setIsUploading(false);
      navigation.navigate("TreatmentInfoScreen");
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
            nextButtonHandler();
          }}
          style={{ marginLeft: 16 }}
        >
          Next
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
