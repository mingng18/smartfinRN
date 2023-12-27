import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
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

import { tuberculosisSymptoms } from "../../../assets/data/symptoms.json";
import { addDocument } from "../../../util/firestoreWR";
import { serverTimestamp, Timestamp } from "firebase/firestore";

function ReportSideEffectScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const [date, setDate] = React.useState(undefined);
  const [submitDate, setSubmitDate] = React.useState(undefined);
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [symptoms, setSymptoms] = React.useState([]);

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
      setHour(hours);
      setMinute(minutes);
      console.log({ hours, minutes });
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

  //TODO update date, hour, minute and symptoms to firebase
  async function submitDataToDatabase() {
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
      };

      await addDocument("side_effect", newSideEffect);
    } catch (error) {
      console.error("Error submitting data to database:", error);
      // Handle the error here (e.g., show an error message to the user)
    } finally {
      setDialogVisible(false);
    }
  }


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
            onPress={() => setDialogVisible(true)}
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
            date={date}
            onConfirm={onConfirmSingle}
            presentationStyle="pageSheet"
          />
          <TimePickerModal
            locale="en-GB"
            visible={timePickerOpen}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
            use24HourClock={false}
          />
          <ReportedDialog
            visible={dialogVisible}
            close={() => {
              submitDataToDatabase();
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default ReportSideEffectScreen;

const ReportedDialog = ({ visible, close }) => (
  <Portal>
    <Dialog onDismiss={close} visible={visible} dismissable={false}>
      <Dialog.Title>Report Successful! </Dialog.Title>
      <Dialog.Content>
        <Text>The healthcare will reviewed it shortly.</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close}>Back to Home Page</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);
