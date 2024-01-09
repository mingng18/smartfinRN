import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Alert, Modal, Pressable, View } from "react-native";
import {
  Button,
  Checkbox,
  IconButton,
  Portal,
  RadioButton,
  Text,
  TextInput,
  Tooltip,
  useTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { tuberculosisSymptoms } from "../../../assets/data/symptoms.json";
import { addDocument } from "../../../util/firestoreWR";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import {
  SIDE_EFFECT_GRADE,
  SIDE_EFFECT_SEVERITY,
  SIDE_EFFECT_STATUS,
} from "../../../constants/constants";
import { useDispatch } from "react-redux";
import {
  createSideEffect,
  fetchSideEffects,
  updateSideEffect,
} from "../../../store/redux/sideEffectSlice";

function ReportSideEffectScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  const [date, setDate] = React.useState(undefined);
  const [submitDate, setSubmitDate] = React.useState(undefined);
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [symptoms, setSymptoms] = React.useState([]);
  // [{ label: "cough", grade: 1 }];
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Report for Side Effect",
    });
  });

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

  //TODO calculate severity
  function calculateSeverity() {
    return symptoms.some((s) => s.grade == 2)
      ? SIDE_EFFECT_SEVERITY.MODERATE
      : symptoms.some((s) => s.grade == 3)
      ? SIDE_EFFECT_SEVERITY.SEVERE
      : SIDE_EFFECT_SEVERITY.MILD;
  }

  //Update date, hour, minute and symptoms to firebase
  async function submitDataToDatabase() {
    if (!submitDate || hour === "" || minute === "" || symptoms.length == 0) {
      Alert.alert("Error", "Please fill in all the details");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      const storedUid = await SecureStore.getItemAsync("uid");
      submitDate.setMinutes(minute);
      submitDate.setHours(hour);
      submitDate.setSeconds(0);

      const newSideEffect = {
        created_timestamp: serverTimestamp(),
        side_effect_occuring_timestamp: Timestamp.fromDate(submitDate),
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
          "Successfully submited",
          "Please seek medical assistance at the hospital immediately."
        );
      } else {
        Alert.alert("Success", "Side Effects successfully reported.");
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
      Alert.alert("Error Submitting", "Please try again later");
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
            // flex: 1,
            height: "100%",
          }}
        >
          <Text variant="titleLarge">When did these symptoms start?</Text>
          <Pressable onPress={() => setCalendarOpen(true)}>
            <View pointerEvents="none">
              <TextInput
                mode="outlined"
                style={{ marginTop: 16 }}
                label="Date"
                placeholder="Starting date of the symptoms"
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
                label="Time"
                placeholder="Starting date of the symptoms"
                value={hour == "" ? `` : `${hour} : ${minute}`}
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
              // marginBottom: 8,
            }}
          >
            <Text variant="titleLarge" style={{}}>
              Symptoms experienced
            </Text>
            <IconButton
              icon="information-outline"
              size={24}
              onPress={() =>
                Alert.alert(
                  "Grade Classification",
                  "Grade 1\nEffects mild and generally not bothersome\n\nGrade 2\nEffects are bothersome and may interfere with doing some activities but are not dangerous\n\nGrade 3\nEffects are serious and interfere with a person’s ability to do basic things like eat or get dressed"
                )
              }
              // onPress={showModal}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text variant="labelSmall">Grade 1 : Mild</Text>
            <Text variant="labelSmall">Grade 2 : Moderate</Text>
            <Text variant="labelSmall">Grade 3 : Serious</Text>
          </View>
          {tuberculosisSymptoms.map((symptom, i) => {
            const [checked, setChecked] = React.useState(1);
            return (
              <View key={`checkbox-${i}`}>
                <Checkbox.Item
                  label={symptom}
                  accessibilityLabel={symptom}
                  mode="android"
                  status={
                    symptoms.some((s) => s.label === symptom)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleCheckboxChange(symptom)}
                  style={{ justifyContent: "flex-start" }}
                  labelStyle={{ textAlign: "left", flexGrow: 0, marginLeft: 8 }}
                  position="leading"
                />
                {symptoms.some((s) => s.label === symptom) && (
                  <View
                    key={`view-${i}`}
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "100%",
                      },
                    ]}
                  >
                    {SIDE_EFFECT_GRADE.map((grade, j) => {
                      const isLast = j === SIDE_EFFECT_GRADE.length - 1;
                      const isFirst = j === 0;
                      return (
                        <Pressable
                          key={`pressable-${j}`}
                          style={[
                            {
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: theme.colors.secondaryContainer,
                              paddingLeft: 16,
                              paddingRight: isLast ? 16 : 0,
                              paddingVertical: 4,
                              borderTopRightRadius: isLast ? 16 : 0,
                              borderBottomRightRadius: isLast ? 16 : 0,
                              borderBottomLeftRadius: isFirst ? 16 : 0,
                            },
                          ]}
                          onPress={() => {
                            setChecked(grade.value);
                            handleGradeChange(symptom, grade.value);
                          }}
                        >
                          <RadioButton.Android
                            value={grade.value}
                            status={
                              checked === grade.value ? "checked" : "unchecked"
                            }
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
          <View style={{ alignItems: "flex-end" }}>
            <Button
              mode="contained"
              style={{ marginTop: 40, marginBottom: 56 }}
              onPress={() => submitDataToDatabase()}
            >
              Report
            </Button>
          </View>
          {/* Modal for date picker and time picker */}
          <View
            style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
          >
            <DatePickerModal
              locale="en-GB"
              mode="single"
              visible={calendarOpen}
              onDismiss={onDismissSingle}
              // date={date}
              onConfirm={onConfirmSingle}
              presentationStyle="pageSheet"
              validRange={validRange}
            />
            <TimePickerModal
              locale="en-GB"
              visible={timePickerOpen}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              use24HourClock={false}
            />
          </View>
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
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
