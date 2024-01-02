import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import * as SecureStore from "expo-secure-store";

import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { addDocument } from "../../../util/firestoreWR";
import { Timestamp } from "firebase/firestore";
import * as Haptics from "expo-haptics";

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();

  const [isReschedule, setIsReschedule] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [bookedDialogVisible, setBookedDialogVisible] = React.useState(false);

  const [date, setDate] = React.useState(undefined);
  const [submitDate, setSubmitDate] = React.useState(null); 
  const [time, setTime] = React.useState();
  const [items, setItems] = React.useState([
    { label: "2:00 pm", value: { hour: 2, minute: 0 } },
    { label: "2:30 pm", value: { hour: 2, minute: 30 } },
    { label: "3:00 pm", value: { hour: 3, minute: 0 } },
    { label: "3:30 pm", value: { hour: 3, minute: 30 } },
    { label: "4:00 pm", value: { hour: 4, minute: 0 } },
    { label: "4:30 pm", value: { hour: 4, minute: 30 } },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params == null ? "Book Appointment" : "Request Appointment",
    });
    if (params != null) {
      setIsReschedule(true);
    }
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
      // console.log(formattedDate);
      setDate(formattedDate);
      setSubmitDate(params.date);
      console.log(submitDate + " submit Date");
    },
    [setCalendarOpen, setDate, setSubmitDate]
  );

  //Filter out the dates other than Monday, Wednesday and Friday
  //The date also is filtered from today
  const isValidDate = (date) => {
    return date.getDay() === 1 || date.getDay() === 3 || date.getDay() === 5;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validRange = {
    startDate: today,
    endDate: undefined,
    disabledDates: Array.from(
      { length: 300 },
      (_, i) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    ).filter((d) => !isValidDate(d)), // Disable all days except Saturdays
  };

  const handleAppointmentSubmission = async () => {
    const storedUid = await SecureStore.getItemAsync("uid");
    console.log(submitDate + " before set time");
    setSubmitDate(new Date().setDate(submitDate));
    console.log(submitDate + " before set time 2");
    submitDate.setHours(time.hour,time.minute, 0);
    // submitDate.setMinutes(0);
    // submitDate.setSeconds(0);
    console.log(submitDate + " after set time");
    addDocument("appointment", {
      patient_id: storedUid,
      healthcare_id: null,
      appointment_status: "pending",
      created_timestamp: Timestamp.now(),
      remarks: "",
      scheduled_timestamp: submitDate,
    });
    // setBookedDialogVisible(true);
    Alert.alert("Booked Successful!", "Please wait for the healthcare to approve it.");
    navigation.goBack();
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        Please select starting date and time
      </Text>

      <Pressable onPress={() => setCalendarOpen(true)}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginTop: 16 }}
            label="Date"
            placeholder="Starting date of the symptoms"
            value={date}
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
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        open={dropdownOpen}
        setOpen={setDropdownOpen}
        value={time}
        setValue={setTime}
        items={items}
        setItems={setItems}
        placeholder="Pick a Time"
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => {
            handleAppointmentSubmission();             // TODO: Fix this Show the dialog to be able to function in ios as well
          }}
        >
          Book
        </Button>
        <Button
          mode="contained-tonal"
          style={{ marginRight: 16 }}
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
      </View>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
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
        {/* //TODO DELETE THIS */}
        {/* <MessageDialog
          visible={bookedDialogVisible}
          close={() => {
            setBookedDialogVisible(false);
            navigation.goBack();
          }}
          title="Book Successful! "
          content="Please wait for the healthcare to approve it."
          buttonText="Back to Home Page"
        /> */}
      </View>
    </View>
  );
}
