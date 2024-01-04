import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Pressable,
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import {
  authenticateStoreNative,
  fetchHealthcareData,
  fetchPatientData,
} from "../../store/redux/authSlice";
import { addDocument, addDocumentWithId } from "../../util/firestoreWR";
import { ScrollView } from "react-native-gesture-handler";
import {
  updateAuthSlice,
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
import LoadingIndicatorDialog from "../ui/LoadingIndicatorDialog";

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
  const [treatment, setTreatment] = React.useState("akurit4");
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
      setDiagnosisDate(formattedDate);
      setSubmitDate(params.date);
    },
    [setCalendarOpen, setDiagnosisDate, setSubmitDate]
  );

  async function saveUserDateToFirestore(userType, userId, profilePicUrl) {
    //Debug use---------------------------------------------------------------
    // console.log(
    //   "email : " + signupInfo.email,
    //   "password : " + signupInfo.password,
    //   "firstName : " + signupInfo.firstName,
    //   "lastName : " + signupInfo.lastName,
    //   "phoneNumber : " + signupInfo.phoneNumber,
    //   "nric_passport : " + signupInfo.nric_passport,
    //   "age : " + signupInfo.age,
    //   "date_of_diagnosis : " + submitDate,
    //   "diagnosis : " + signupInfo.diagnosis,
    //   "diagnosis 2: " + diagnosis,
    //   "treatment_duration_months : " + signupInfo.durationOfTreatment,
    //   "treatment : " + signupInfo.currentTreatment,
    //   "treatment 2: " + treatment,
    //   "number_of_tablets : " + signupInfo.numberOfTablets,
    //   "profilePictureURI : " + signupInfo.profilePictureURI
    // );
    //Debug use---------------------------------------------------------------
    try {
      await addDocumentWithId(userType, userId, {
        email: signupInfo.email,
        first_name: signupInfo.firstName,
        last_name: signupInfo.lastName,
        phone_number: signupInfo.phoneNumber,
        nric_passport: signupInfo.nric_passport,
        age: signupInfo.age,
        date_of_diagnosis: submitDate,
        diagnosis: diagnosis,
        treatment_duration_months: parseInt(durationOfTreatment),
        treatment: treatment,
        number_of_tablets: parseInt(numberOfTablets),
        profile_pic_url: profilePicUrl,
        compliance_status: "Good",
        gender: signupInfo.gender,
        nationality: signupInfo.nationality,
        notes: "",
      });
    } catch (error) {
      console.log(error + " error occured when saving user data to firestore"); //Debug use
    }
  }

  async function uploadImage(uri, path, userId, token) {
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
          console.log("timestamp is: " + submitDate.toISOString());
          console.log("number of tablets is: " + parseInt(numberOfTablets));
          console.log(
            "duration of treatment is: " + parseInt(durationOfTreatment)
          );
          dispatch(
            fetchPatientData({
              age: signupInfo.age,
              compliance_status: "Good",
              date_of_diagnosis: submitDate,
              diagnosis: diagnosis,
              email: signupInfo.email,
              first_name: signupInfo.firstName,
              gender: signupInfo.gender,
              last_name: signupInfo.lastName,
              nationality: signupInfo.nationality,
              notes: "",
              nric_passport: signupInfo.nric_passport,
              number_of_tablets: numberOfTablets,
              phone_number: signupInfo.phoneNumber,
              profile_pic_url: downloadURL,
              treatment: treatment,
              treatment_duration_months: durationOfTreatment,
            })
          );
          setIsUploading(false);
          await saveUserDateToFirestore("patient", userId, downloadURL);
          Alert.alert(
            "Sign Up Successful!",
            "Thanks for signing up!",
            [
              {
                text: "OK",
                onPress: () => {},
                style: "cancel",
              },
            ],
            {
              cancelable: false,
            }
          );
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

    // Update redux store

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
      dispatch(
        updateMedicalInformation({
          diagnosis: diagnosis,
          durationOfTreatment: durationOfTreatment,
          currentTreatment: treatment,
          numberOfTablets: numberOfTablets,
        })
      );

      //Upload profile picture
      const ppStorageRef = ref(storage, "patientProfilePicture/" + user.uid);
      setIsUploading(true);
      await uploadImage(
        signupInfo.profilePictureURI,
        ppStorageRef,
        user.uid,
        token.token
      );
    } catch (error) {
      Alert.alert(
        "Signup failed, please check your email and try again later."
      );
    }
  }

  const user = useSelector((state) => state.authObject);
  React.useEffect(() => {
    console.log("number of taabnles: " + user.numberOfTablets);
    console.log("date_ofdiagnosis: " + user.date_of_diagnosis);
    if (isEditing) {
      //treatment
      // setDiagnosisDate(user.date_of_diagnosis.slice(0, 10));
      setDiagnosis(user.diagnosis);
      // console.log(typeof Number(user.treatment_duration_months)); // Debug use 
      setDurationOfTreatment(parseInt(user.treatment_duration_months));
      setTreatment(user.treatment);
      setNumberOfTablets(parseInt(user.number_of_tablets));
    }
  }, [isEditing]);

  //TODO add update treatment
  function handleUpdateTreatment() {}

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        // paddingHorizontal: 16,
        // height: "100%",
      }}
    >
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
        keyboardType="numeric"
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
        setValue={setTreatment}
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
        keyboardType="numeric"
        value={numberOfTablets}
        onChangeText={(text) => setNumberOfTablets(text)}
        error={credentialsInvalid.numberOfTablets}
      />
      {isEditing ? (
        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button
            mode="contained"
            onPress={() => handleUpdateTreatment()}
            style={{ marginLeft: 16 }}
          >
            Update
          </Button>
        </View>
      ) : (
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
      )}
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={calendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
        presentationStyle="pageSheet"
      />
      <LoadingIndicatorDialog
        visible={isUploading}
        close={() => {
          setDialogVisible(false);
        }}
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
