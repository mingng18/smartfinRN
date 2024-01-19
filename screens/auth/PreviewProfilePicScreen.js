import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePictureURI } from "../../store/redux/signupSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  setUserType,
} from "../../store/redux/authSlice";
import { addDocumentWithId } from "../../util/firestoreWR";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";

export default function PreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const dispatch = useDispatch();
  const storage = getStorage();
  const auth = getAuth();
  const signupMode = useSelector((state) => state.signupObject.signupMode);
  const signupInfo = useSelector((state) => state.signupObject);

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uri, setUri] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Picture",
    });
    setUri(params.uri);
  });

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

  async function uploadImage(uri, path, userId, token) {
    setIsUploading(true);
    console.log("Uploading image to " + uri);
    console.log("User is  " + userId);
    const imageData = await fetch(uri);
    const imageBlob = await imageData.blob();

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
          //Save user data to firestore
          await saveUserDateToFirestore("healthcare", userId, downloadURL);
          //Save userToken, userId and userType to redux
          dispatch(authenticateStoreNative(token, userId, "healthcare"));
          setIsUploading(false);
        });
      },
      () => {}
    );
  }

  async function signupHealthcare() {
    dispatch(updateProfilePictureURI(uri))
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

    try {
      //Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupInfo.email,
        signupInfo.password
      );
      const user = userCredential.user;
      const token = await user.getIdTokenResult();

      //Upload profile picture
      const ppStorageRef = ref(storage, "healthcareProfilePicture/" + user.uid);
      setIsUploading(true);
      const donwloadURL = await uploadImage(
        uri,
        ppStorageRef,
        user.uid,
        token.token
      );
      setIsUploading(false);

    } catch (error) {
      Alert.alert(
        "Signup failed, please check your email and try again later."
        );
        console.log(error); //Debug use
        setIsUploading(false);
    }
  }

  async function nextButtonHandler() {
    setIsUploading(true);

    try {
      dispatch(updateProfilePictureURI({ profilePictureURI: uri }));
    } catch (error) {
      return Alert.alert("Upload failed, please try again later.");
    } finally {
      if (signupMode === "patient") {
        navigation.navigate("TreatmentInfoScreen");
        setIsUploading(false);
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
          {signupMode === "patient" ? "Next" : "Signup"}
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
      <LoadingIndicatorDialog
        visible={isUploading}
        close={() => {
          setIsUploading(false);
        }}
        title = {"Signing up"}
        bodyText={"Please wait patiently"}
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
