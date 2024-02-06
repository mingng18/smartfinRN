import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, View, Alert, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import * as SecureStore from "expo-secure-store";

import LoadingIndicatorDialog from "../ui/LoadingIndicatorDialog";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";

import {
  authenticateStoreNative,
  fetchPatientData,
  setUserType,
} from "../../store/redux/authSlice";
import { addDocumentWithId, editDocument } from "../../util/firestoreWR";
import {
  clearSignupSlice,
  updateMedicalInformation,
} from "../../store/redux/signupSlice";
import {
  BLANK_PROFILE_PIC,
  COMPLIANCE_STATUS,
  DIAGNOSIS,
  FIREBASE_COLLECTION,
  NUMBER_OF_TABLETS,
  TREATMENT,
  USER_TYPE,
} from "../../constants/constants";

export default function TreatmentInfoForm({ isEditing }) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const signupInfo = useSelector((state) => state.signupObject);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authObject);
  const { t } = useTranslation("auth");

  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [calendarLocale, setCalendarLocale] = React.useState("");

  const [diagnosisDate, setDiagnosisDate] = React.useState("");
  //Diagnosis Drop down
  const [diagnosisOpen, setDiagnosisOpen] = React.useState(false);
  const [diagnosis, setDiagnosis] = React.useState("SPPTB");
  const [diagnosisData, setDiagnosisData] = React.useState(DIAGNOSIS);

  //Treatment Drop down
  const [treatmentOpen, setTreatmentOpen] = React.useState(false);
  const [treatment, setTreatment] = React.useState("akurit4");
  const [treatmentData, setTreatmentData] = React.useState(TREATMENT);

  //Number of tablets Drop down
  const [numberOfTabletsOpen, setNumberOfTabletsOpen] = React.useState(false);
  const [numberOfTablets, setNumberOfTablets] = React.useState();
  const [numberOfTabletsData, setNumberOfTabletsData] =
    React.useState(NUMBER_OF_TABLETS);

  //Text inputs
  const [durationOfTreatment, setDurationOfTreatment] = React.useState(0);
  const [credentialsInvalid, setCredentialsInvalid] = React.useState({
    durationOfTreatment: false,
    numberOfTablets: false,
    diagnosisDate: false,
  });
  const [submitDate, setSubmitDate] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useEffect(() => {
    const loadCalendarLocale = async () => {
      SecureStore.getItemAsync("storedLocale").then((locale) => {
        setCalendarLocale(locale);
      });
    };

    loadCalendarLocale();
  }, []);

  //Calendar
  const onDismissSingle = React.useCallback(() => {
    setCalendarOpen(false);
  }, [setCalendarOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setCalendarOpen(false);

      //If user did not select a date, default to today's date
      if (
        params.date == null ||
        params.date == undefined ||
        params.date == ""
      ) {
        //Format iosDate to date
        const dateObject = new Date();
        dateObject.setHours(0, 0, 0, 0);
        console.log(dateObject);
        console.log(dateObject.toISOString());
        const formattedDate = `${dateObject.getFullYear()}-${(
          dateObject.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${dateObject
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        setDiagnosisDate(formattedDate);
        setSubmitDate(dateObject);
        return;
      }

      //Format iosDate to date
      const dateObject = new Date(params.date);
      dateObject.setHours(0, 0, 0, 0);
      console.log(dateObject);
      console.log(dateObject.toISOString());
      const formattedDate = `${dateObject.getFullYear()}-${(
        dateObject.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
      setDiagnosisDate(formattedDate);
      setSubmitDate(dateObject);
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
        compliance_status: COMPLIANCE_STATUS.GOOD,
        gender: signupInfo.gender,
        nationality: signupInfo.nationality,
        notes: "",
      });
    } catch (error) {
      return Alert.alert(t("error_saving_user_data"), t("try_again_later"));
    }
  }

  async function uploadImage(uri, path, userId, token) {
    try {
      let imageData = "";
      let imageBlob = "";
      if (uri == "" || uri == null) {

        dispatch(setUserType({ user_type: signupInfo.signupMode }));
        dispatch(
          fetchPatientData({
            age: signupInfo.age,
            compliance_status: COMPLIANCE_STATUS.GOOD,
            date_of_diagnosis: submitDate.setDate(submitDate.getDate() + 1),
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
            profile_pic_url: "",
            treatment: treatment,
            treatment_duration_months: durationOfTreatment,
          })
        );

        dispatch(clearSignupSlice());
        dispatch(authenticateStoreNative(token, userId, "patient")),
        await saveUserDateToFirestore("patient", userId, "");
        

      } else {
        imageData = await fetch(uri);
        imageBlob = await imageData.blob();
        uploadTask = await path.put(imageBlob);

        path.getDownloadURL().then(async (downloadURL) => {
          console.log("File available at ", downloadURL);
          dispatch(setUserType({ user_type: signupInfo.signupMode }));
          dispatch(
            fetchPatientData({
              age: signupInfo.age,
              compliance_status: COMPLIANCE_STATUS.GOOD,
              date_of_diagnosis: submitDate.setDate(submitDate.getDate() + 1),
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
  
          dispatch(clearSignupSlice());
          dispatch(authenticateStoreNative(token, userId, "patient")),
          await saveUserDateToFirestore("patient", userId, downloadURL);
          
        
          });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsUploading(false);
      Alert.alert(
        t("sign_up_successful"),
        t("thanks_for_signing_up"),
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
      
    } catch (error) {
      console.log(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsUploading(false);
      return Alert.alert(
        t("profile_picture_upload_failed"),
        t("try_again_later")
      );
    }
  }

  //Handle Submission Function : To be called when user clicks on the sign up button
  async function handleFinishSignUpSubmission() {
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      return Alert.alert(t("invalid_input"), t("check_entered_details"));
    }

    //Calling APIs to create user, upload profile picture, then add user data to firestore
    try {
      //Create user
      auth()
        .createUserWithEmailAndPassword(signupInfo.email, signupInfo.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const token = await user.getIdToken();
          dispatch(
            updateMedicalInformation({
              diagnosis: diagnosis,
              durationOfTreatment: durationOfTreatment,
              currentTreatment: treatment,
              numberOfTablets: numberOfTablets,
            })
          );

          //Upload profile picture
          const ppStorageRef = storage().ref(
            "patientProfilePicture/" + user.uid
          );
          setIsUploading(true);
          await uploadImage(
            signupInfo.profilePictureURI,
            ppStorageRef,
            user.uid,
            token
          );
        });
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return Alert.alert(
            t("email_already_exists"),
            t("use_another_email_or_reset_password")
          );
        case "auth/invalid-email":
          return Alert.alert(t("invalid_email"), t("valid_email"));
        case "auth/weak-password":
          return Alert.alert(t("weak_password"), t("enter_valid_password"));
        default:
          console.log("Unknown error occured" + error);
          //Delete user created just now if sign up fails because of other reasons
          // await deleteUser(user.uid);
          return Alert.alert(t("unknown_error"), t("unknown_error_message"));
      }
    }
    setIsUploading(false);
  }

  React.useEffect(() => {
    // console.log("first name: " + user.first_name);
    // console.log("diagnosis: " + user.diagnosis);
    // console.log("number of taabnles: " + user.number_of_tablets);
    // console.log("date_ofdiagnosis: " + user.date_of_diagnosis);
    if (isEditing) {
      //treatment
      // setDiagnosisDate(user.date_of_diagnosis.slice(0, 10));
      setDiagnosis(user.diagnosis);
      // console.log(typeof Number(user.treatment_duration_months)); // Debug use
      setDurationOfTreatment(parseInt(user.treatment_duration_months));
      setDiagnosisDate(
        new Date(user.date_of_diagnosis).toISOString().slice(0, 10)
      );
      setSubmitDate(new Date(user.date_of_diagnosis));
      setTreatment(user.treatment);
      setNumberOfTablets(parseInt(user.number_of_tablets));
    }
  }, [isEditing]);

  //TODO healthcare update profile
  async function handleUpdateTreatment() {
    if (user.user_type == USER_TYPE.PATIENT) {
      // console.log("user first name: " + user.first_name);
      try {
        await editDocument(FIREBASE_COLLECTION.PATIENT, user.user_uid, {
          //unchanged part
          // first_name: user.first_name,
          // last_name: user.last_name,
          // gender: user.gender,
          // phone_number: user.phone_number,
          // nationality: user.nationality,
          // nric_passport: user.nric_passport,
          // age: user.age,
          // compliance_status: user.compliance_status,
          // email: user.email,
          // notes: user.notes,
          // profile_pic_url: user.profile_pic_url,
          //changed part
          date_of_diagnosis: submitDate.toISOString(),
          diagnosis: diagnosis,
          treatment_duration_months: durationOfTreatment,
          treatment: treatment,
          number_of_tablets: numberOfTablets,
        });
        dispatch(
          fetchPatientData({
            //unchanged part
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            nationality: user.nationality,
            nric_passport: user.nric_passport,
            age: user.age,
            compliance_status: user.compliance_status,
            email: user.email,
            notes: user.notes,
            profile_pic_url: user.profile_pic_url,
            //changed part
            date_of_diagnosis: submitDate.setDate(submitDate.getDate() + 1),
            diagnosis: diagnosis,
            treatment_duration_months: durationOfTreatment,
            treatment: treatment,
            number_of_tablets: numberOfTablets,
          })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(t("update_success"), t("update_success_message"));
        navigation.goBack();
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t("update_failed"), t("update_failed_message"));
        console.log(error);
      }
    }
  }

  const today = new Date();
  const validRange = {
    startDate: undefined,
    endDate: today,
    disabledDates: Array.from({ length: 365 }, (_, i) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      return date <= today ? null : date;
    }).filter((disabledDate) => disabledDate !== null), // Disable all days after today
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        {t("diagnosis")}
      </Text>
      <Pressable onPress={() => setCalendarOpen(true)}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginVertical: 16 }}
            label={t("diagnosis_date")}
            placeholder={t("diagnosis_date_ph")}
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
        placeholder={t("diagnosis")}
        listMode="SCROLLVIEW"
      />
      <TextInput
        mode="outlined"
        label={t("diagnosis_duration")}
        style={{ marginTop: 16 }}
        placeholder={durationOfTreatment ? durationOfTreatment.toString() : "5"}
        maxLength={2}
        value={`${durationOfTreatment}`}
        keyboardType="numeric"
        onChangeText={(text) => setDurationOfTreatment(text)}
        error={credentialsInvalid.durationOfTreatment}
      />
      <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 16 }}>
        {t("my_treatment")}
      </Text>
      <CustomDropDownPicker
        zIndex={3000}
        zIndexInverse={1000}
        open={treatmentOpen}
        setOpen={setTreatmentOpen}
        value={treatment}
        setValue={setTreatment}
        items={treatmentData}
        setItems={setTreatmentData}
        placeholder={t("my_treatment")}
        listMode="SCROLLVIEW"
      />
      <View style={{ marginBottom: 16 }} />
      <CustomDropDownPicker
        zIndex={2000}
        open={numberOfTabletsOpen}
        setOpen={setNumberOfTabletsOpen}
        value={numberOfTablets}
        setValue={setNumberOfTablets}
        items={numberOfTabletsData}
        setItems={setNumberOfTabletsData}
        placeholder={t("tablet_no")}
        listMode="SCROLLVIEW"
      />
      {isEditing ? (
        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button
            mode="contained"
            onPress={() => handleUpdateTreatment()}
            style={{ marginLeft: 16 }}
          >
            {t("update_button")}
          </Button>
        </View>
      ) : (
        <View
          style={{
            marginTop: 40,
            flexDirection: "row-reverse",
          }}
        >
          <Button
            mode="contained"
            onPress={() => handleFinishSignUpSubmission()}
            style={{ marginLeft: 16 }}
          >
            {t("sign_up_button")}
          </Button>
          <Button
            mode="contained-tonal"
            onPress={() => {
              navigation.goBack();
            }}
          >
            {t("back")}
          </Button>
        </View>
      )}
      <DatePickerModal
        locale={calendarLocale}
        mode="single"
        visible={calendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
        presentationStyle="pageSheet"
        validRange={validRange}
      />
      <LoadingIndicatorDialog
        visible={isUploading}
        close={() => {
          setIsUploading(false);
        }}
        title={t("signing_up")}
        bodyText={t("wait_patiently")}
      />
    </View>
  );
}
