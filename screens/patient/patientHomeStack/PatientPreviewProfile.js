import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { editDocument } from "../../../util/firestoreWR";
import { FIREBASE_COLLECTION } from "../../../constants/constants";
import { fetchPatientData } from "../../../store/redux/authSlice";

export default function PatientPreviewProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const user = useSelector((state) => state.authObject);
  const storage = getStorage();
  const dispatch = useDispatch();

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

  async function uploadImage(uri) {
    console.log("user is : " + user.user_uid)
    const ppStorageRef = ref(storage, "patientProfilePicture/" + user.user_uid);

    try {
      if (uri == "" || uri == null) {
        return Alert.alert("No image selected", "Please select an image");
      }

      const imageData = await fetch(uri);
      const imageBlob = await imageData.blob();

      // Compress the image
      // const compressedImage = await compressImage(imageBlob);
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
            await editDocument(FIREBASE_COLLECTION.PATIENT, user.user_uid, {
              profile_pic_url: downloadURL,
            });

            dispatch(
              fetchPatientData({
                //unchanged
                age: user.age,
                compliance_status: user.compliance_status,
                date_of_diagnosis: user.date_of_diagnosis,
                diagnosis: user.diagnosis,
                email: user.email,
                first_name: user.first_name,
                gender: user.gender,
                last_name: user.last_name,
                nationality: user.nationality,
                notes: user.notes,
                nric_passport: user.nric_passport,
                number_of_tablets: user.number_of_tablets,
                phone_number: user.phone_number,
                treatment: user.treatment,
                treatment_duration_months: user.treatment_duration_months,
                //changed
                profile_pic_url: downloadURL,
              })
            );

            setIsUploading(false);
            navigation.goBack();
          });
        }
      );
    } catch (error) {
      setIsUploading(false);
      console.log("Update profile pic failed: " + error);
      return Alert.alert(
        "Update profile picture failed",
        "Please try again later"
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
