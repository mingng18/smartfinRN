import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Pressable,
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import { authenticateStoreNative } from "../../store/redux/authSlice";
import { addDocument, addDocumentWithId } from "../../util/firestoreWR";
import { ScrollView } from "react-native-gesture-handler";
import {
  updateMedicalInformation,
  updateProfilePictureURI,
} from "../../store/redux/signupSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { DIAGNOSIS, TREATMENT } from "../../constants/constants";

export default function TreatmentInfoForm({ isEditing }) {
  //TODO handle editing case

  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const auth = getAuth();
  const signupInfo = useSelector((state) => state.signupObject);
  const dispatch = useDispatch();
  const storage = getStorage();

  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const [diagnosisDate, setDiagnosisDate] = React.useState("");
  //Diagnosis Drop down
  const [diagnosisOpen, setDiagnosisOpen] = React.useState(false);
  const [diagnosis, setDiagnosis] = React.useState("SPPTB");
  const [diagnosisData, setDiagnosisData] = React.useState(DIAGNOSIS);

  //Treatment Drop down
  const [treatmentOpen, setTreatmentOpen] = React.useState(false);
  const [treatment, setTreatment] = React.useState(null);
  const [treatmentData, setTreatmentData] = React.useState(TREATMENT);

  //Text inputs
  const [durationOfTreatment, setDurationOfTreatment] = React.useState(0);
  const [numberOfTablets, setNumberOfTablets] = React.useState(0);
  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    durationOfTreatment: false,
    numberOfTablets: false,
    diagnosisDate: false,
  });
  const [submitDate, setSubmitDate] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useState(() => {
    console.log("treatment change: " + treatment);
  }, [treatment]);

  //Calendar
  const onDismissSingle = React.useCallback(() => {
    setCalendarOpen(false);
  }, [setCalendarOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setCalendarOpen(false);

      //Format iosDate to date
      const dateObject = new Date(params.date);
      const formattedDate = `${dateObject.getFullYear()}-${(
        dateObject.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
      // console.log(formattedDate);
      setDiagnosisDate(formattedDate);
      setSubmitDate(params.date);
    },
    [setCalendarOpen, setDiagnosisDate,setSubmitDate]
  );

  async function saveUserDateToFirestore(userType, userId, profilePicUrl) {
    await addDocumentWithId(userType, userId, {
      email: signupInfo.email,
      first_name: signupInfo.firstName,
      last_name: signupInfo.lastName,
      phone_number: signupInfo.phoneNumber,
      nric_passport: signupInfo.nric_passport,
      age: signupInfo.age,
      date_of_diagnosis: submitDate,
      diagnosis: signupInfo.diagnosis,
      treatment_duration_month: parseInt(signupInfo.durationOfTreatment),
      treatment: signupInfo.currentTreatment,
      number_of_tablets: parseInt(signupInfo.numberOfTablets),
      profile_pic_url: profilePicUrl,
      compliance_status: "Compliant",
      gender: signupInfo.gender,
      nationality: signupInfo.nationality,
      notes: "",
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
          await saveUserDateToFirestore("patient", userId, downloadURL);
        });
      }
    );
  }

  //Handle Submission Function : To be called when user clicks on the sign up button
  async function handleFinishSignUpSubmission() {
    //format date to firebase format
    setSubmitDate(new Date().setDate(submitDate));

    //Validate input
    const durationOfTreatmentRegex = /^[0-9]{1,3}$/; //1-3 digits
    const numberOfTabletsRegex = /^(?!0\d)\d{1,2}$/; //1-2 digits, cannot start with 0
    const diagnosisDateRegex = /.+/; //Any character, cannot blank

    const isDurationOfTreatmentValid =
      durationOfTreatmentRegex.test(durationOfTreatment);
    const isNumberOfTabletsValid = numberOfTabletsRegex.test(numberOfTablets);
    const isDiagnosisDateValid = diagnosisDateRegex.test(diagnosisDate);

    setCredentialsInvalid({
      durationOfTreatment: !isDurationOfTreatmentValid,
      numberOfTablets: !isNumberOfTabletsValid,
      diagnosisDate: !isDiagnosisDateValid,
    });

    if (
      !isDurationOfTreatmentValid ||
      !isNumberOfTabletsValid ||
      !isDiagnosisDateValid
    ) {
      return Alert.alert("Invalid input", "Please check your entered details.");
    }

    //Update redux store
    dispatch(
      updateMedicalInformation({
        // dateOfDiagnosis: submitDate,
        diagnosis: diagnosis,
        durationOfTreatment: durationOfTreatment,
        currentTreatment: treatment,
        numberOfTablets: numberOfTablets,
      })
    );

    //Debug use---------------------------------------------------------------
    console.log(
      "email : " + signupInfo.email,
      "password : " + signupInfo.password,
      "firstName : " + signupInfo.firstName,
      "lastName : " + signupInfo.lastName,
      "phoneNumber : " + signupInfo.phoneNumber,
      "nric_passport : " + signupInfo.nric_passport,
      "age : " + signupInfo.age,
      "date_of_diagnosis : " + submitDate,
      "diagnosis : " + signupInfo.diagnosis,
      "treatment_duration_month : " + signupInfo.durationOfTreatment,
      "treatment : " + signupInfo.currentTreatment,
      "number_of_tablets : " + signupInfo.numberOfTablets,
      "profilePictureURI : " + signupInfo.profilePictureURI
    );
    //Debug use---------------------------------------------------------------

    //Calling APIs to create user, upload profile picture, then add user data to firestore
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
      const ppStorageRef = ref(storage, "patientProfilePicture/" + user.uid);
      setIsUploading(true);
      const donwloadURL = await uploadImage(
        signupInfo.profilePictureURI,
        ppStorageRef,
        user.uid
      );
      setIsUploading(false);
    } catch (error) {
      Alert.alert(
        "Signup failed, please check your email and try again later."
      );
      console.log(error); //Debug use
    }

    Alert.alert(
      "Sign Up Successful!",
      "You can now use our app!",
      [
        {
          text: "Go to home page",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  return (
    <>
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        My Diagnosis
      </Text>
      <Pressable onPress={() => setCalendarOpen(true)}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginVertical: 16 }}
            label="Date of Diagnosis"
            placeholder="Starting date of the symptoms"
            value={diagnosisDate}
            right={
              <TextInput.Icon
                icon="calendar-blank"
                color={theme.colors.onBackground}
              />
            }
            maxLength={20}
            error={credentialsInvalid.diagnosisDate}
          />
        </View>
      </Pressable>
      <CustomDropDownPicker
        open={diagnosisOpen}
        setOpen={setDiagnosisOpen}
        value={diagnosis}
        setValue={setDiagnosis}
        items={diagnosisData}
        setItems={setDiagnosisData}
        placeholder="Diagnosis"
      />
      <TextInput
        mode="outlined"
        label="Duration of Diagnosis (months)"
        style={{ marginTop: 16 }}
        placeholder="2"
        maxLength={2}
        value={durationOfTreatment}
        onChangeText={(text) => setDurationOfTreatment(text)}
        error={credentialsInvalid.durationOfTreatment}
      />
      <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 16 }}>
        My Current Treatment
      </Text>
      <CustomDropDownPicker
        open={treatmentOpen}
        setOpen={setTreatmentOpen}
        value={treatment}
        setValue={(value) => setTreatment(value)}
        items={treatmentData}
        setItems={setTreatmentData}
        placeholder="Treatment"
      />
      <TextInput
        mode="outlined"
        label="Number of Tablets"
        style={{ marginTop: 16 }}
        placeholder="5"
        maxLength={2}
        value={numberOfTablets}
        onChangeText={(text) => setNumberOfTablets(text)}
        error={credentialsInvalid.numberOfTablets}
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => handleFinishSignUpSubmission()}
          style={{ marginLeft: 16 }}
        >
          Sign Up
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
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={calendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
        presentationStyle="pageSheet"
      />
    </>
  );
}
