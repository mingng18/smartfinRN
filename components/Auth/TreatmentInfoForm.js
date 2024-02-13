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
  authenticate,
  authenticateStoreNative,
  fetchPatientData,
  logoutDeleteNative,
  setFirstTimeLogin,
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
  const localUser = useSelector((state) => state.authObject);
  const { t } = useTranslation("auth");

  const [calendarLocale, setCalendarLocale] = React.useState("");

  const [diagnosisCalendarOpen, setDiagnosisCalendarOpen] =
    React.useState(false);
  const [diagnosisDate, setDiagnosisDate] = React.useState("");
  const [diagnosisSubmitDate, setDiagnosisSubmitDate] = React.useState("");

  const [treatmentStartCalendarOpen, setTreatmentStartCalendarOpen] =
    React.useState(false);
  const [treatmentStartDate, setTreatmentStartDate] = React.useState("");
  const [treatmentStartSubmitDate, setTreatmentStartSubmitDate] =
    React.useState("");

  const [treatmentEndCalendarOpen, setTreatmentEndCalendarOpen] =
    React.useState(false);
  const [treatmentEndDate, setTreatmentEndDate] = React.useState("");
  const [treatmentEndSubmitDate, setTreatmentEndSubmitDate] =
    React.useState("");

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
    treatmentStartDate: false,
    treatmentEndDate: false,
  });
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
  const onDismissSingle = () => {
    setDiagnosisCalendarOpen(false);
    setTreatmentStartCalendarOpen(false);
    setTreatmentEndCalendarOpen(false);
  };

  const onConfirmDiagnosisSingle = React.useCallback((params) => {
    setDiagnosisCalendarOpen(false);
    if (params.date == null) {
      return;
    }
    //Format iosDate to date
    const dateObject = new Date(params.date);
    setDiagnosisDate(formatDate(dateObject));
    setDiagnosisSubmitDate(dateObject);
  }, []);

  const onConfirmTreatmentStartSingle = React.useCallback((params) => {
    setTreatmentStartCalendarOpen(false);
    if (params.date == null) {
      return;
    }
    //Format iosDate to date
    const dateObject = new Date(params.date);
    setTreatmentStartDate(formatDate(dateObject));
    setTreatmentStartSubmitDate(dateObject);
  }, []);

  const onConfirmTreatmentEndSingle = React.useCallback((params) => {
    setTreatmentEndCalendarOpen(false);
    if (params.date == null) {
      return;
    }
    //Format iosDate to date
    const dateObject = new Date(params.date);
    setTreatmentEndDate(formatDate(dateObject));
    setTreatmentEndSubmitDate(dateObject);
  }, []);

  function formatDate(dateObject) {
    dateObject.setHours(0, 0, 0, 0);
    console.log(dateObject);
    console.log(dateObject.toISOString());
    const formattedDate = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;

    return formattedDate;
  }

  function revertFailedSignup(){
    try {
      auth().currentUser.delete();
      dispatch(setFirstTimeLogin({ first_time_login: false }));
      dispatch(authenticate({isAuthenticated: false}))
      dispatch(logoutDeleteNative())
      dispatch(clearSignupSlice())
      console.log("Signup reverted")
    } catch (error) {
      console.log("Failed to revert signup")
    }
  }

  async function saveUserDateToFirestore(userType, userId, profilePicUrl) {
    try {
      await addDocumentWithId(userType, userId, {
        email: signupInfo.email,
        first_name: signupInfo.firstName,
        last_name: signupInfo.lastName,
        phone_number: signupInfo.phoneNumber,
        nric_passport: signupInfo.nric_passport,
        age: signupInfo.age,
        date_of_diagnosis: diagnosisSubmitDate,
        treatment_start_date: treatmentStartSubmitDate,
        treatment_end_date: treatmentEndSubmitDate,
        diagnosis: diagnosis,
        treatment_duration_months: parseInt(durationOfTreatment),
        treatment: treatment,
        number_of_tablets: parseInt(numberOfTablets),
        profile_pic_url: profilePicUrl,
        compliance_status: COMPLIANCE_STATUS.GOOD,
        gender: signupInfo.gender,
        nationality: signupInfo.nationality,
        notes: "",
        medication_reminder: true,
        appointment_reminder: true,
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
            date_of_diagnosis: diagnosisSubmitDate.setDate(
              diagnosisSubmitDate.getDate() + 1
            ),
            treatment_start_date: treatmentStartSubmitDate.setDate(
              treatmentStartSubmitDate.getDate() + 1
            ),
            treatment_end_date: treatmentEndSubmitDate.setDate(
              treatmentEndSubmitDate.getDate() + 1
            ),
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
            medication_reminder: true,
            appointment_reminder: true,
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
              date_of_diagnosis: diagnosisSubmitDate.setDate(
                diagnosisSubmitDate.getDate() + 1
              ),
              treatment_start_date: treatmentStartSubmitDate.setDate(
                treatmentStartSubmitDate.getDate() + 1
              ),
              treatment_end_date: treatmentEndSubmitDate.setDate(
                treatmentEndSubmitDate.getDate() + 1
              ),
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
              medication_reminder: true,
              appointment_reminder: true,
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
      revertFailedSignup();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsUploading(false);
      return Alert.alert(
        t("profile_picture_upload_failed"),
        t("try_again_later")
      );
    }
  }

  async function uploadProfilePicAndWriteIntoDatabase(uid, userToken) {
    try {
      console.log("uploadProfilePicAndWriteIntoDatabase token: " + userToken);
      console.log("uploadProfilePicAndWriteIntoDatabase uid: " + uid);
      dispatch(
        updateMedicalInformation({
          diagnosis: diagnosis,
          durationOfTreatment: durationOfTreatment,
          currentTreatment: treatment,
          numberOfTablets: numberOfTablets,
        })
      );
      //Upload profile picture
      const ppStorageRef = storage().ref("patientProfilePicture/" + uid);
      setIsUploading(true);
      await uploadImage(
        signupInfo.profilePictureURI,
        ppStorageRef,
        uid,
        userToken
      );
    } catch (error) {
      console.log("Sign up user failed: " + error);
      revertFailedSignup();
    }
  }

  //Handle Submission Function : To be called when user clicks on the sign up button
  async function handleFinishSignUpSubmission() {
    //Validate input
    const durationOfTreatmentRegex = /^[0-9]{1,3}$/; //1-3 digits
    const numberOfTabletsRegex = /^(?!0\d)\d{1,2}$/; //1-2 digits, cannot start with 0
    const diagnosisDateRegex = /.+/; //Any character, cannot blank
    const treatmentStartDateRegex = /.+/; //Any character, cannot blank
    const treatmentEndDateRegex = /.+/; //Any character, cannot blank

    const isDurationOfTreatmentValid =
      durationOfTreatmentRegex.test(durationOfTreatment);
    const isNumberOfTabletsValid = numberOfTabletsRegex.test(numberOfTablets);
    const isDiagnosisDateValid = diagnosisDateRegex.test(diagnosisDate);
    const isTreatmentStartDateValid =
      treatmentStartDateRegex.test(treatmentStartDate);
    const isTreatmentEndDateValid =
      treatmentEndDateRegex.test(treatmentEndDate);

    setCredentialsInvalid({
      durationOfTreatment: !isDurationOfTreatmentValid,
      numberOfTablets: !isNumberOfTabletsValid,
      diagnosisDate: !isDiagnosisDateValid,
      treatmentStartDate: !isTreatmentStartDateValid,
      treatmentEndDate: !isTreatmentEndDateValid,
    });

    if (
      !isDurationOfTreatmentValid ||
      !isNumberOfTabletsValid ||
      !treatmentStartDate ||
      !treatmentEndDate ||
      !isDiagnosisDateValid
    ) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return Alert.alert(t("invalid_input"), t("check_entered_details"));
    }

    if (localUser.first_time_login) {
      try {
        console.log("first time login");
        console.log("token: " + localUser.token);
        console.log("uid: " + localUser.user_uid);

        uploadProfilePicAndWriteIntoDatabase(localUser.user_uid, localUser.token);
        dispatch(setFirstTimeLogin({ first_time_login: false }));
      } catch (error) {
        console.log("Sign up for first time login user failed: " + error);
      }
    } else {
      //Calling APIs to create user, upload profile picture, then add user data to firestore
      try {
        //Create user
        auth()
          .createUserWithEmailAndPassword(signupInfo.email, signupInfo.password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const token = await user.getIdToken();

            uploadProfilePicAndWriteIntoDatabase(user.uid, token);
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
      setDiagnosisDate(
        new Date(localUser.date_of_diagnosis).toISOString().slice(0, 10)
      );
      setDiagnosisSubmitDate(new Date(localUser.date_of_diagnosis));

      setDiagnosis(localUser.diagnosis);
      setDurationOfTreatment(parseInt(localUser.treatment_duration_months));

      setTreatment(localUser.treatment);
      setNumberOfTablets(parseInt(localUser.number_of_tablets));

      console.log(
        "treatment start date: " +
          new Date(localUser.treatment_start_date).toISOString().slice(0, 10)
      );
      console.log(
        "treatment end date: " +
          new Date(localUser.treatment_end_date).toISOString().slice(0, 10)
      );
      setTreatmentStartDate(
        new Date(localUser.treatment_start_date).toISOString().slice(0, 10)
      );
      setTreatmentStartSubmitDate(new Date(localUser.treatment_start_date));

      setTreatmentEndDate(
        new Date(localUser.treatment_end_date).toISOString().slice(0, 10)
      );
      setTreatmentEndSubmitDate(new Date(localUser.treatment_end_date));
    }
  }, [isEditing]);

  //TODO healthcare update profile
  async function handleUpdateTreatment() {
    if (localUser.user_type == USER_TYPE.PATIENT) {
      // console.log("user first name: " + user.first_name);
      try {
        await editDocument(FIREBASE_COLLECTION.PATIENT, localUser.user_uid, {
          date_of_diagnosis: diagnosisSubmitDate,
          diagnosis: diagnosis,
          treatment_duration_months: durationOfTreatment,
          treatment: treatment,
          number_of_tablets: numberOfTablets,
          treatment_start_date: treatmentStartSubmitDate,
          treatment_end_date: treatmentEndSubmitDate,
        });
        dispatch(
          fetchPatientData({
            //unchanged part
            first_name: localUser.first_name,
            last_name: localUser.last_name,
            gender: localUser.gender,
            phone_number: localUser.phone_number,
            nationality: localUser.nationality,
            nric_passport: localUser.nric_passport,
            age: localUser.age,
            compliance_status: localUser.compliance_status,
            email: localUser.email,
            notes: localUser.notes,
            profile_pic_url: localUser.profile_pic_url,
            //changed part
            date_of_diagnosis: diagnosisDate,
            diagnosis: diagnosis,
            treatment_duration_months: durationOfTreatment,
            treatment: treatment,
            number_of_tablets: numberOfTablets,
            treatment_start_date: treatmentStartDate,
            treatment_end_date: treatmentEndDate,
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
  const validEndRange = {
    startDate: treatmentStartSubmitDate,
    endDate: undefined,
  };
  const validStartRange = {
    startDate: diagnosisSubmitDate,
    endDate: today,
  };

  const validDiagnosisRange = {
    startDate: undefined,
    endDate: undefined,
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
      <Pressable
        onPress={() => {
          setDiagnosisCalendarOpen(true);
        }}
      >
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
        style={{ marginTop: 12 }}
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
      <Pressable
        onPress={() => {
          setTreatmentStartCalendarOpen(true);
        }}
      >
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginBottom: 12 }}
            label={t("treatment_start_date")}
            placeholder={t("treatment_start_date")}
            value={treatmentStartDate}
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
      <Pressable
        onPress={() => {
          setTreatmentEndCalendarOpen(true);
        }}
      >
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginBottom: 16 }}
            label={t("treatment_end_date")}
            placeholder={t("treatment_end_date")}
            value={treatmentEndDate}
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
        visible={diagnosisCalendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmDiagnosisSingle}
        presentationStyle="pageSheet"
        validRange={validDiagnosisRange}
      />
      <DatePickerModal
        locale={calendarLocale}
        mode="single"
        visible={treatmentStartCalendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmTreatmentStartSingle}
        presentationStyle="pageSheet"
        validRange={validStartRange}
      />
      <DatePickerModal
        locale={calendarLocale}
        mode="single"
        visible={treatmentEndCalendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmTreatmentEndSingle}
        presentationStyle="pageSheet"
        validRange={validEndRange}
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
