import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import MessageDialog from "../../../components/ui/MessageDialog";

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();

  const [isReschedule, setIsReschedule] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [bookedDialogVisible, setBookedDialogVisible] = React.useState(false);

  const [date, setDate] = React.useState(undefined);
  const [time, setTime] = React.useState();

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
    },
    [setCalendarOpen, setDate]
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

  //DropDown for time
  const [items, setItems] = React.useState([
    { label: "2:00 pm", value: 200 },
    { label: "2:30 pm", value: 230 },
    { label: "3:00 pm", value: 300 },
    { label: "3:30 pm", value: 330 },
    { label: "4:00 pm", value: 400 },
    { label: "4:30 pm", value: 430 },
  ]);

  //TODO Submit Appointment Request
  const handleAppointmentSubmission = () => {};

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
            handleAppointmentSubmission();
            setBookedDialogVisible(true); // Show the dialog
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
        <MessageDialog
          visible={bookedDialogVisible}
          close={() => {
            setBookedDialogVisible(false);
            navigation.goBack();
          }}
          title="Book Successful! "
          content="Please wait for the healthcare to approve it."
          buttonText="Back to Home Page"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
