import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Pressable, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import * as SecureStore from "expo-secure-store";
import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { addDocument, deleteDocument } from "../../../util/firestoreWR";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import {
  createAppointment,
  deleteAppointment,
  fetchBookedAppointmentDates,
} from "../../../store/redux/appointmentSlice";
import {
  APPOINTMENT_TIME,
  FIREBASE_COLLECTION,
} from "../../../constants/constants";

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();

  const bookedAppointmentDates = useSelector(
    (state) => state.bookedAppointmentDateObject.bookedAppointmentDates
  );

  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [isReschedule, setIsReschedule] = React.useState();
  const [lastAppointment, setLastAppointment] = React.useState();
  const [date, setDate] = React.useState(undefined);
  const [submitDate, setSubmitDate] = React.useState(null);
  const [time, setTime] = React.useState();
  const [items, setItems] = React.useState(APPOINTMENT_TIME);

  const updateItemValue = (timeSlot, newValue) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.label === timeSlot) {
          console.log("item value " + item.label);
          // Update the value of the item with the specified key
          return { ...item, disabled: newValue };
        }
        return item;
      });
    });
  };

  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Book Appointment",
    });
  });

  function disableTimeSlotsBasedOnDate(params, isReschedule) {
    let selectedDate = null;
    if(isReschedule){
      selectedDate = params;
    }else{
      selectedDate = params.date;
    }

    console.log("params date: " + selectedDate)
    if (isBookedDate(selectedDate)) {
      console.log("this is a booked date, todo : disable the time slot ");
      const timeSlots = bookedAppointmentDates
        .filter((timeSlot) =>
          timeSlot.startsWith(selectedDate.toISOString().slice(0, 10))
        )
        .map((timeSlot) => {
          console.log("time slot here " + timeSlot);
          const localeTime = new Date(timeSlot); // Convert to Date object
          return localeTime.toLocaleTimeString().slice(0, 4) + " pm"; // Convert to time string
        });

        timeSlots.forEach(timeslot => {
          updateItemValue(timeslot, true);
        });
    }
    else{ //If the date is not booked at all, enable all the time slot
      items.forEach(item => {
        updateItemValue(item.label, false);
      });
    }
  }

  React.useEffect(() => {
    async () => await fetchBookedAppointmentDates();

    if (params && params.isReschedule) {
      setIsReschedule(params.isReschedule);
      setLastAppointment(params.lastAppointment);
      console.log("last appointment " + params.lastAppointment.scheduled_timestamp);
      //Fri Jan 19 2024 23:59:59 GMT+0900 params date
      console.log("finding the format here: " + new Date(params.lastAppointment.scheduled_timestamp).toISOString());
      console.log("finding the format here: " + new Date(params.lastAppointment.scheduled_timestamp).toLocaleDateString());
      console.log("finding the format here: " + new Date(params.lastAppointment.scheduled_timestamp).toUTCString());
      disableTimeSlotsBasedOnDate(new Date(params.lastAppointment.scheduled_timestamp), true);

      const inputDate = new Date(params.lastAppointment.scheduled_timestamp);
      setDate(formatDate(inputDate));
      setSubmitDate(inputDate);

      //TODO !!!idk it wont work

      // const hour = inputDate.getHours();
      // const minute = inputDate.getMinutes();

      // //to the format { hour: 2, minute: 30 }
      // const formattedTime = {
      //   hour: hour % 12 || 12, // Convert 24-hour time to 12-hour time
      //   minute: minute, // Format minute as "00" if it's 0
      // };
      // console.log(hour);
      // console.log(minute);
      // console.log(JSON.stringify(formattedTime));

      // setTime(formattedTime);
    }
  }, [params]);

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

      //Reset the time picker to null
      setTime(null);
      
      //Check if the timeslot already booked or not, if booked, disable the time slot
      console.log("params date " + params)
      disableTimeSlotsBasedOnDate(params, false)

      setDate(formatDate(params.date));
      setSubmitDate(params.date);
      console.log(submitDate + " submit Date");
    },
    [setCalendarOpen, setDate, setSubmitDate]
  );

  const formatDate = (date) => {
    //Format iosDate to date
    //in the format "YYYY-MM-DD"
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  //Filter out the dates other than Monday, Wednesday and Friday
  //The date also is filtered from today
  const isValidDate = (date) => {
    return date.getDay() === 1 || date.getDay() === 3 || date.getDay() === 5;
  };

  //Check if the date is booked and filter out the booked dates
  const isBookedDate = (date) => {
    const bookedDates = bookedAppointmentDates.map((dateStr) => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0); // Set the time part to midnight
      return date;
    });

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return bookedDates.some(
      (bookedDate) => bookedDate.getTime() === compareDate.getTime()
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validRange = {
    startDate: today,
    endDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 365
    ),
    disabledDates: Array.from(
      { length: 366 },
      (_, i) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    ).filter((d) => !isValidDate(d)), // Disable all booked dates and dates other than Monday, Wednesday and Friday
  };

  const handleAppointmentSubmission = async () => {
    if (date == undefined || time == null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid Input", "Please fill in all the input");
    }

    if (isReschedule) {
      deleteDocument(FIREBASE_COLLECTION.APPOINTMENT, lastAppointment.id);
      dispatch(deleteAppointment({ id: lastAppointment.id }));
    }

    const storedUid = await SecureStore.getItemAsync("uid");
    setSubmitDate(new Date(submitDate));
    submitDate.setHours(time.hour + 12, time.minute, 0);
    // console.log("Final submit date: " + submitDate);

    console.log("the date is " + new Date().toISOString());
    const newAppointment = {
      patient_id: storedUid,
      healthcare_id: null,
      appointment_status: "pending",
      created_timestamp: new Date(),
      remarks: "",
      scheduled_timestamp: submitDate,
    };

    addDocument("appointment", newAppointment);
    // setBookedDialogVisible(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isReschedule) {
      Alert.alert(
        "Reschedule Successful!"
      )
    }else{
      Alert.alert(
        "Booked Successful!"
      );
    }
    dispatch(
      createAppointment({
        patient_id: storedUid,
        healthcare_id: null,
        appointment_status: "pending",
        created_timestamp: new Date().toISOString(),
        remarks: "",
        scheduled_timestamp: submitDate.toISOString(),
      })
    );
    navigation.popToTop();
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
            handleAppointmentSubmission(); // TODO: Fix this Show the dialog to be able to function in ios as well
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
