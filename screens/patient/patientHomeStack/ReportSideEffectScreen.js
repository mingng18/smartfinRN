import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Alert, Pressable, View } from "react-native";
import {
  Button,
  Checkbox,
  IconButton,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { addDocument } from "../../../util/firestoreWR";
import {
  SIDE_EFFECT_GRADE,
  SIDE_EFFECT_SEVERITY,
  SIDE_EFFECT_STATUS,
} from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { createSideEffect } from "../../../store/redux/sideEffectSlice";
import { useTranslation } from "react-i18next";

function ReportSideEffectScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();
  const { t } = useTranslation("patient");

  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [calendarLocale, setCalendarLocale] = React.useState("");

  const [date, setDate] = React.useState(undefined);
  const [submitDate, setSubmitDate] = React.useState(undefined);
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [symptoms, setSymptoms] = React.useState([]);
  const [otherSymptom, setOtherSymptom] = React.useState("");
  // [{ label: "cough", grade: 1 }];
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("report_for_side_effect_header_title"),
    });

    const loadCalendarLocale = async () => {
      SecureStore.getItemAsync("storedLocale").then((locale) => {
        console.log(locale + "Report side effect");
        setCalendarLocale(locale);
      });
    };

    loadCalendarLocale();
  });

  //Calendar
  const onDismissSingle = React.useCallback(() => {
    setCalendarOpen(false);
  }, [setCalendarOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setCalendarOpen(false);
      if (params.date === undefined) {
        return;
      }

      //Format iosDate to date
      const dateObject = new Date(params.date);
      const formattedDate = `${dateObject.getFullYear()}-${(
        dateObject.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
      console.log(formattedDate);

      setDate(formattedDate);
      setSubmitDate(params.date);
    },
    [setCalendarOpen, setDate]
  );

  //Time Picker
  const onDismiss = React.useCallback(() => {
    setTimePickerOpen(false);
  }, [setTimePickerOpen]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setTimePickerOpen(false);
      // Pad the hours and minutes with leading zeros if necessary
      const paddedHour = String(hours).padStart(2, "0");
      const paddedMinute = String(minutes).padStart(2, "0");
      console.log(`${paddedHour}:${paddedMinute}`);
      setHour(paddedHour);
      setMinute(paddedMinute);
    },
    [setTimePickerOpen]
  );

 

  //TODO calculate severity
  function calculateSeverity() {
    return symptoms.some((s) => s.grade == 3)
      ? SIDE_EFFECT_SEVERITY.GRADE_3
      : symptoms.some((s) => s.grade == 2)
      ? SIDE_EFFECT_SEVERITY.GRADE_2
      : SIDE_EFFECT_SEVERITY.GRADE_1;
  }

  //Update date, hour, minute and symptoms to firebase
  async function submitDataToDatabase() {
    if (
      !submitDate ||
      hour === "" ||
      minute === "" ||
      (symptoms.length == 0 && otherSymptom === "")
    ) {
      if (
        (!submitDate || hour === "" || minute === "") &&
        symptoms.length === 0 &&
        otherSymptom === ""
      ) {
        Alert.alert(t("error_title"), t("error_fill_details_message"));
      } else if (symptoms.length === 0 && otherSymptom === "") {
        Alert.alert(t("symptom_error_title"), t("symptom_error_message"));
      } else if (!submitDate || hour === "" || minute === "") {
        Alert.alert(t("date_time_error_title"), t("date_time_error_message"));
      } else {
        Alert.alert(t("something_wrong_title"), t("something_wrong_message"));
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      const storedUid = await SecureStore.getItemAsync("uid");
      submitDate.setMinutes(minute);
      submitDate.setHours(hour);
      submitDate.setSeconds(0);
      if (otherSymptom !== "") {
        symptoms.push({ label: otherSymptom, grade: 0 });
      }

      const newSideEffect = {
        created_timestamp: new Date(),
        side_effect_occuring_timestamp: new Date(submitDate),
        reviewed_timestamp: null,
        healthcare_id: null,
        patient_id: storedUid,
        se_status: SIDE_EFFECT_STATUS.PENDING,
        symptoms: symptoms,
        remarks: null,
        severity: calculateSeverity(),
      };

      await addDocument("side_effect", newSideEffect);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (symptoms.some((s) => s.grade > 1)) {
        Alert.alert(
          t("successfully_submitted_title"),
          t("symptom_grade_message")
        );
      } else {
        Alert.alert(t("success_title"), t("side_effects_reported_message"));
      }
      dispatch(
        createSideEffect({
          created_timestamp: new Date().toISOString(),
          side_effect_occuring_timestamp: submitDate.toISOString(),
          reviewed_timestamp: null,
          healthcare_id: null,
          patient_id: storedUid,
          se_status: SIDE_EFFECT_STATUS.PENDING,
          symptoms: symptoms,
          remarks: null,
          severity: calculateSeverity(),
        })
      );
      navigation.popToTop();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t("error_submitting_title"), t("try_again_later_message"));
      console.error("Error submitting data to database:", error);
      // Handle the error here (e.g., show an error message to the user)
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

   //Symptoms Checkbox
   const handleCheckboxChange = (value) => {
    console.log("symptom now is " + value);
    const isSymptomSelected = symptoms.some((item) => item.label === value);

    if (isSymptomSelected) {
      // If the symptom is already selected, remove it from the array
      console.log("removing symptom");
      const updatedSymptoms = symptoms.filter((item) => item.label !== value);
      console.log(
        "symptoms are " +
          updatedSymptoms.map((symptom) => {
            return `${symptom.label}: ${symptom.grade}`;
          })
      );
      setSymptoms(updatedSymptoms);
    } else {
      console.log("adding symptom");
      const updatedSymptoms = [...symptoms, { label: value, grade: 1 }];
      console.log(
        "symptoms are " +
          updatedSymptoms.map((symptom) => {
            return `${symptom.label}: ${symptom.grade}`;
          })
      );
      setSymptoms(updatedSymptoms);
    }
  };

  const handleGradeChange = (symptomName, newGrade) => {
    const symptomIndex = symptoms.findIndex((s) => s.label === symptomName);

    if (symptomIndex !== -1) {
      // If the symptom is found in the array, update its grade
      const updatedSymptoms = [...symptoms];
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        grade: newGrade,
      };
      console.log(
        "updated grade are " +
          updatedSymptoms.map((symptom) => {
            return `${symptom.label}: ${symptom.grade}`;
          })
      );

      // Update the state with the new array of symptoms
      setSymptoms(updatedSymptoms);
    } else {
      // If the symptom is not found, log an error message or handle as per your requirement
      console.log(`Symptom "${symptomName}" not found in symptoms array.`);
    }
  };

  const tuberculosisSymptoms = [
    { key: "eyesight_worsening", label: t("eyesight_worsening") },
    { key: "yellowing_of_eyes", label: t("yellowing_of_eyes") },
    { key: "ringing_sound", label: t("ringing_sound") },
    { key: "tingling_sensation", label: t("tingling_sensation") },
    { key: "bruises", label: t("bruises") },
    { key: "bleeding", label: t("bleeding") },
    { key: "joint_pains", label: t("joint_pains") },
    { key: "rashes", label: t("rashes") },
    { key: "mood_worsening_changes", label: t("mood_worsening_changes") },
    { key: "weight_loss", label: t("weight_loss") },
    { key: "tiredness", label: t("tiredness") },
    { key: "seizures", label: t("seizures") },
    { key: "itchiness", label: t("itchiness") },
    { key: "dark_urine", label: t("dark_urine") },
    { key: "orange_urine", label: t("orange_urine") },
    { key: "stomach_pain_particularly_right_upper_area", label: t("stomach_pain_particularly_right_upper_area") },
  ];
  

  return (
    <>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            backgroundColor: theme.colors.background,
            height: "100%",
          }}
        >
          <Text variant="titleLarge">{t("symptoms_start_question")}</Text>
          <Pressable onPress={() => setCalendarOpen(true)}>
            <View pointerEvents="none">
              <TextInput
                mode="outlined"
                style={{ marginTop: 16 }}
                label={t("date_label")}
                placeholder={t("date_placeholder")}
                value={date}
                onChangeText={(value) => setDate(value)}
                right={
                  <TextInput.Icon
                    icon="calendar-blank"
                    color={theme.colors.onBackground}
                  />
                }
                maxLength={100}
              />
            </View>
          </Pressable>
          <Pressable onPress={() => setTimePickerOpen(true)}>
            <View pointerEvents="none">
              <TextInput
                mode="outlined"
                style={{ marginTop: 16 }}
                label={t("time_label")}
                placeholder={t("time_placeholder")}
                value={hour === "" ? "" : `${hour}:${minute}`}
                onChangeText={(value) => setDate(value)}
                right={
                  <TextInput.Icon
                    icon="clock"
                    color={theme.colors.onBackground}
                  />
                }
                maxLength={100}
              />
            </View>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <Text variant="titleLarge" style={{}}>
              {t("symptoms_title")}
            </Text>
            <IconButton
              icon="information-outline"
              size={24}
              onPress={() =>
                Alert.alert(
                  t("grade_classification_title"),
                  `${t("grade_1_description")}\n\n${t(
                    "grade_2_description"
                  )}\n\n${t("grade_3_description")}`
                )
              }
              // onPress={showModal}
            />
          </View>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            {t("choose_all_applicable")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <Text
              variant="labelSmall"
              style={{ marginRight: 16, marginBottom: 4 }}
            >
              {t("grade_1_desc")}
            </Text>
            <Text
              variant="labelSmall"
              style={{ marginRight: 16, marginBottom: 4 }}
            >
              {t("grade_2_desc")}
            </Text>
            <Text
              variant="labelSmall"
              style={{ marginRight: 16, marginBottom: 4 }}
            >
              {t("grade_3_desc")}
            </Text>
          </View>
          {tuberculosisSymptoms.map((symptom, i) => {
  const isChecked = symptoms.some((s) => s.label === symptom.key);
  const selectedSymptom = symptoms.find((s) => s.label === symptom.key);
  const selectedGrade = selectedSymptom ? selectedSymptom.grade : 1;

  return (
    <View key={`checkbox-${i}`}>
      <Checkbox.Item
        label={symptom.label}
        accessibilityLabel={symptom.label}
        mode="android"
        status={isChecked ? "checked" : "unchecked"}
        onPress={() => handleCheckboxChange(symptom.key)}
        style={{ justifyContent: "flex-start" }}
        labelStyle={{ textAlign: "left", flexGrow: 0, marginLeft: 8 }}
        position="leading"
      />
      {isChecked && (
        <View
          key={`view-${i}`}
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {SIDE_EFFECT_GRADE.map((grade, j) => {
            const isLast = j === SIDE_EFFECT_GRADE.length - 1;
            const isFirst = j === 0;
            return (
              <Pressable
                key={`pressable-${j}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.colors.secondaryContainer,
                  paddingLeft: 16,
                  paddingRight: isLast ? 16 : 0,
                  paddingVertical: 4,
                  borderTopRightRadius: isLast ? 16 : 0,
                  borderBottomRightRadius: isLast ? 16 : 0,
                  borderBottomLeftRadius: isFirst ? 16 : 0,
                }}
                onPress={() => {
                  handleGradeChange(symptom.key, grade.value);
                }}
              >
                <RadioButton.Android
                  value={grade.value}
                  status={selectedGrade === grade.value ? "checked" : "unchecked"}
                  pointerEvents="none"
                />
                <Text variant="labelSmall">{grade.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
})}

          <TextInput
            mode="outlined"
            style={{ flex: 1, marginLeft: 24, marginTop: 4 }}
            label={t("other_symptom_label")}
            placeholder={t("other_symptom_placeholder")}
            maxLength={100}
            value={otherSymptom}
            onChangeText={(value) => setOtherSymptom(value)}
          />
          {symptoms.some((s) => s.grade > 1) && (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.error, marginTop: 16 }}
            >
              {t("symptom_grade_message")}
            </Text>
          )}
          <View style={{ alignItems: "flex-end" }}>
            <Button
              mode="contained"
              style={{ marginTop: 40, marginBottom: 56 }}
              onPress={() => submitDataToDatabase()}
            >
              {t("report_button")}
            </Button>
          </View>
          {/* Modal for date picker and time picker */}
          <View
            style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
          >
            <DatePickerModal
              locale={calendarLocale}
              mode="single"
              visible={calendarOpen}
              onDismiss={onDismissSingle}
              // date={date}
              onConfirm={onConfirmSingle}
              presentationStyle="pageSheet"
              validRange={validRange}
            />
            <TimePickerModal
              locale={calendarLocale}
              visible={timePickerOpen}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              use24HourClock={false}
              defaultInputType="keyboard"
            />
          </View>
        </View>
      </ScrollView>
      {/* <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal> */}
      {/* <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 16,
            paddingVertical: 40,
            marginHorizontal: 16,
            borderRadius: 16,
            justifyContent: "flex-start",
          }}
        >
          
          <Text variant="labelSmall">
            Grade 1 : Effects mild and generally not bothersome
          </Text>
          <Text variant="labelSmall">
            Grade 2 : Effects are bothersome and may interfere with doing some
            activities but are not dangerous
          </Text>
          <Text variant="labelSmall">
            Grade 3 : Effects are serious and interfere with a person’s ability
            to do basic things like eat or get dressed
          </Text>
          <View style={{ flexDirection: "row-reverse" }}>
            <Button
              mode="contained-tonal"
              onPress={hideModal}
              style={{ marginRight: 16 }}
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal> */}
    </>
  );
}

export default ReportSideEffectScreen;
