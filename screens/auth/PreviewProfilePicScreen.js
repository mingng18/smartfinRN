import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { authenticateStoreNative } from "../../store/redux/authSlice";
import { addDocumentWithId } from "../../util/firestoreWR";

export default function PreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const dispatch = useDispatch();
  const storage = getStorage();
  const auth = getAuth();
  const signupEmail = useSelector((state) => state.signupObject.email);
  const signupMode = useSelector((state) => state.signupObject.signupMode);
  const signupInfo = useSelector((state) => state.signupObject);

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  //TODO handle isEditing state

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Picture",
    });
    setUri(params.uri);
    setIsEditing(params.isEditing);
  });

  async function saveUserDateToFirestore(userType, userId, profilePicUrl) {
    await addDocumentWithId(userType, userId, {
      email: signupInfo.email,
      first_name: signupInfo.firstName,
      last_name: signupInfo.lastName,
      category: signupInfo.category,
      role: signupInfo.role,
      staff_id: signupInfo.staffId,
      profile_picture: profilePicUrl,
    });
  }

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

  async function signupHealthcare() {
    //Debug use
    console.log(
      "email: " + signupInfo.email,
      "password: " + signupInfo.password,
      "first_name: " + signupInfo.firstName,
      "last_name: " + signupInfo.lastName,
      "category: " + signupInfo.category,
      "role: " + signupInfo.role,
      "staff_id: " + signupInfo.staffId,
      "profile_picture: " + signupInfo.profilePictureURI
    );

    try {
      //Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupInfo.email,
        signupInfo.password
      );
      const user = userCredential.user;
      const token = await user.getIdTokenResult();

      dispatch(authenticateStoreNative(token.token, user.uid));

      //Upload profile picture
      const ppStorageRef = ref(storage, "healthcareProfilePicture/" + user.uid);
      setIsUploading(true);
      const donwloadURL = await uploadImage(
        signupInfo.profilePictureURI,
        ppStorageRef,
        user.uid
      );
      setIsUploading(false);

      //Add user data to firestore
    } catch (error) {
      Alert.alert(
        "Signup failed, please check your email and try again later."
      );
      console.log(error); //Debug use
    }

    //todo : signup healthcare here
  }

  async function nextButtonHandler() {
    setIsUploading(true);

    try {
      dispatch(updateProfilePictureURI({ profilePictureURI: uri }));
    } catch (error) {
      return Alert.alert("Upload failed, please try again later.");
    } finally {
      setIsUploading(false);
      if (signupMode === "patient") {
        navigation.navigate("TreatmentInfoScreen");
      } else {
        signupHealthcare();
        //todo : signup healthcare here
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
          {signupMode === "patient" ? "Next" : isEditing ? "Update" : "Signup"}
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
