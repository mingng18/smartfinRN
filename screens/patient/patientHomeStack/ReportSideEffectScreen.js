import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { tuberculosisSymptoms } from "../../../assets/data/symptoms.json";
import { addDocument } from "../../../util/firestoreWR";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { SIDE_EFFECT_SEVERITY } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { fetchSideEffects } from "../../../store/redux/sideEffectSlice";

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
  const dispatch = useDispatch();

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
      setHour(paddedHour);
      setMinute(paddedMinute);
    },
    [setTimePickerOpen]
  );

  //Symptoms Checkbox
  const handleCheckboxChange = (value) => {
    let newArray = [...symptoms];
    if (newArray.includes(value)) {
      newArray = newArray.filter((oldValue) => oldValue !== value);
    } else {
      newArray.push(value);
    }
    setSymptoms(newArray);
  };

  //TODO calculate severity
  function calculateSeverity() {
    return SIDE_EFFECT_SEVERITY.SEVERE;
  }

  //TODO update date, hour, minute and symptoms to firebase
  async function submitDataToDatabase() {
    if (!submitDate || hour === "" || minute === "" || symptoms.length == 0) {
      Alert.alert("Error", "Please fill in all the details");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      const storedUid = await SecureStore.getItemAsync("uid");
      submitDate.setMinutes(hour);
      submitDate.setHours(minute);
      submitDate.setSeconds(0);

      const newSideEffect = {
        created_timestamp: serverTimestamp(),
        side_effect_occuring_timestamp: Timestamp.fromDate(submitDate),
        reviewed_timestamp: null,
        healthcare_id: null,
        patient_id: storedUid,
        se_status: "pending",
        symptoms: symptoms,
        remarks: null,
        severity: calculateSeverity(),
      };

      await addDocument("side_effect", newSideEffect);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error Submitting", "Please try again later");
      console.error("Error submitting data to database:", error);
      // Handle the error here (e.g., show an error message to the user)
    } finally {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Side Effects successfully reported.");
      const storedUid = await SecureStore.getItemAsync("uid");
      dispatch(fetchSideEffects(storedUid));
      navigation.popToTop();
    }
  }

  const today = new Date();
  const validRange = {
    startDate: undefined,
    endDate: today,
    disabledDates: Array.from(
      { length: 365 },
      (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        return date <= today ? null : date;
      }
    ).filter((disabledDate) => disabledDate !== null), // Disable all days after today
  };

  return (
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
          flex: 1,
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
        <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 8 }}>
          Symptoms experienced
        </Text>
        {tuberculosisSymptoms.map((symptom, i) => (
          <Checkbox.Item
            key={symptom}
            label={symptom}
            accessibilityLabel={symptom}
            mode="android"
            status={symptoms.includes(symptom) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxChange(symptom)}
            style={{ justifyContent: "flex-start" }}
            labelStyle={{ textAlign: "left", flexGrow: 0, marginLeft: 8 }}
            position="leading"
          />
        ))}
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
  );
}

export default ReportSideEffectScreen;
