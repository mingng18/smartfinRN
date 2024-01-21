import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";
import {
  APPOINTMENT_STATUS,
  HORIZONTAL_CARD_TYPE,
} from "../../constants/constants";
import TextListButton from "../../components/ui/TextListButton";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../util/wordUtil";

export default function HealthcareAppointmentScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const pendingAppointments = useSelector(
    (state) => state.appointmentObject.pendingAppointments
  );

  const [selectedDate, setSelectedDate] = React.useState("");
  const [callingAppointment, setcallingAppointment] = React.useState(null);
  // const [appointmentNotesPatientName, setAppointmentNotesPatientName] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const containerStyle = { backgroundColor: "white", margin: 30, padding: 20 };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

    function showAppointmentNotesRecorderHandler(appointmentData){
      showModal(true);
      setcallingAppointment(appointmentData);
    }

  const marked = React.useMemo(() => {
    const allDates = [
      ...appointments.map((item) =>
        new Date(item.scheduled_timestamp).toISOString().slice(0, 10)
      ),
      ...pendingAppointments.map((item) =>
        new Date(item.scheduled_timestamp).toISOString().slice(0, 10)
      ),
    ];

    return allDates.reduce((acc, date) => {
      const appointmentMatch = appointments.some(
        (item) =>
          new Date(item.scheduled_timestamp).toISOString().slice(0, 10) === date
      );
      const pendingAppointmentMatch = pendingAppointments.some(
        (item) =>
          new Date(item.scheduled_timestamp).toISOString().slice(0, 10) === date
      );
      if (appointmentMatch || pendingAppointmentMatch) {
        acc[date] = {
          selected: true,
          selectedColor: appointmentMatch
            ? theme.colors.secondaryContainer
            : theme.colors.primaryContainer,
          selectedTextColor: theme.colors.onBackground,
        };
      }
      return acc;
    }, {});
  }, [appointments]);

  const AppointmentHorizontalCard = ({ isPending }) => {
    const chosenAppointment = isPending ? pendingAppointments : appointments;
    const matchedAppointment = chosenAppointment.filter(
      (item) =>
        new Date(item.scheduled_timestamp).toISOString().slice(0, 10) ===
          selectedDate &&
        (item.appointment_status === APPOINTMENT_STATUS.ACCEPTED ||
          item.appointment_status === APPOINTMENT_STATUS.PENDING)
    );

    if (matchedAppointment.length > 0) {
      return (
        <>
          {matchedAppointment.map((appointment, i) => {
            return (
              <HorizontalCard
                key={i}
                profilePic={appointment.patient_data.profile_pic_url}
                subject={capitalizeFirstLetter(
                  appointment.patient_data.first_name
                )}
                status={capitalizeFirstLetter(appointment.appointment_status)}
                date={new Date(appointment.scheduled_timestamp)
                  .toISOString()
                  .slice(0, 10)}
                time={new Date(
                  appointment.scheduled_timestamp
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
                color={
                  isPending
                    ? theme.colors.primaryContainer
                    : theme.colors.secondaryContainer
                }
                onPressedCallback={() => {
                  navigate("HealthcareAppointmentDetailsScreen", {
                    appointment: appointment,
                  });
                }}
                cardType={
                  isPending
                    ? HORIZONTAL_CARD_TYPE.DEFAULT
                    : HORIZONTAL_CARD_TYPE.VIDEO_CALL_APPOINTMENT
                }
                iconOnPressedCallBack={() => {
                  showAppointmentNotesRecorderHandler(appointment);
                }}
              />
            );
          })}
        </>
      );
    } else {
      return (
        <Text variant="bodyLarge">
          {!isPending
            ? "You don't have any accepted appointment on this day"
            : "All the appointments had been accepted!"}
        </Text>
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => hideModal()}
            contentContainerStyle={containerStyle}
          >
            <Text variant="titleLarge" style={{marginVertical:8}}>Appointment Notes</Text>
            <View style={{ marginVertical: 16 }}>
              <Text variant="titleMedium" style={{ marginVertical: 8 }}>
                Patient Information
              </Text>
              <Text variant="bodyLarge" style={{ marginVertical: 8 }}>
                Name: {callingAppointment?.patient_data.first_name} {callingAppointment?.patient_data.last_name}
              </Text>
              <Text variant="titleMedium" style={{ marginVertical: 8 }}>
                Appointment Information
              </Text>
              <Text variant="bodyLarge" style={{ marginVertical: 8 }}>
                Date: {new Date(callingAppointment?.scheduled_timestamp)
                  .toISOString()
                  .slice(0, 10)}
              </Text>
              <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
                Time: {new Date(
                  callingAppointment?.scheduled_timestamp
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 8 }}>
                Remarks/Notes
              </Text>
              <TextInput
                mode="outlined"
                label="Remarks/Notes"
                placeholder="Write some notes here"
                multiline={true}
                numberOfLines={10}
                style={{ marginVertical: 8 }}
              ></TextInput>
              <Button
                mode="contained"
                onPress={() => {
                  hideModal();
                }}
                style={{ marginTop: 8 }}
              >
                Save
              </Button>
            </View>
          </Modal>
        </Portal>
        <Calendar
          theme={{
            calendarBackground: theme.colors.background,
            monthTextColor: theme.colors.onBackground,
            textDayFontFamily: "DMSans-Regular",
            textMonthFontFamily: "DMSans-Regular",
            textDayHeaderFontFamily: "DMSans-Regular",
            arrowColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...marked,
            [selectedDate]: {
              selected: true,
              selectedColor: theme.colors.surfaceContainerHigh,
              selectedTextColor: theme.colors.onBackground,
            },
          }}
        />
        <View
          style={{
            flexDirection: "row-reverse",
            marginTop: 16,
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <Text>Accepted</Text>
          <View
            style={{
              borderRadius: 24,
              width: 16,
              height: 16,
              backgroundColor: theme.colors.secondaryContainer,
              marginRight: 8,
            }}
          />
          <Text style={{ marginRight: 24 }}>Pending</Text>
          <View
            style={{
              borderRadius: 24,
              width: 16,
              height: 16,
              backgroundColor: theme.colors.primaryContainer,
              marginRight: 8,
            }}
          />
        </View>
        <AppointmentHorizontalCard />
        <Divider style={{ marginTop: 24, height: 1 }} />
        <Text variant="titleLarge" style={{ marginTop: 24, marginBottom: 16 }}>
          Appointment Requests
        </Text>
        {/* <TextListButton
          text={"Appointment Requests"}
          onPressCallback={() => navigate("AllAppointmentRequestScreen")}
        /> */}
        <AppointmentHorizontalCard isPending={true} />
      </ScrollView>
    </View>
  );
}
