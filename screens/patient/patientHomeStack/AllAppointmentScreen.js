import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import {} from "../../../assets/blank-profile-pic.png";
import {
  APPOINTMENT_STATUS,
  BLANK_PROFILE_PIC,
} from "../../../constants/constants";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { Timestamp } from "firebase/firestore";
import { capitalizeFirstLetter } from "../../../util/capsFirstWord";
import { useSelector } from "react-redux";
import { fetchDocument } from "../../../util/firestoreWR";

function AllAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const [acceptedAppointment, setAcceptedAppointment] = React.useState([]);
  const [pendingAppointment, setPendingAppointment] = React.useState([]);
  const [completedAppointment, setCompletedAppointment] = React.useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "All Appointments",
    });
  });

  //Seperate the appointment into accepeted, pending and completed
  React.useEffect(() => {
    setAcceptedAppointment(
      appointments.filter(
        (appointment) =>
          appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      )
    );

    setPendingAppointment(
      appointments.filter(
        (appointment) =>
          appointment.appointment_status === APPOINTMENT_STATUS.PENDING
      )
    );

    setCompletedAppointment(
      appointments
        .filter(
          (appointment) =>
            appointment.appointment_status === APPOINTMENT_STATUS.COMPLETED
        )
        .sort((a, b) => a.scheduled_timestamp - b.scheduled_timestamp)
    );
  }, [appointments]);

  //Determine the container color
  //If it is accepted, the color is bluie
  //otherwise it is grey color
  function containerColor(appointment) {
    return appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      ? theme.colors.secondaryContainer
      : theme.colors.surfaceContainer;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 16 }} />
        {acceptedAppointment.map((appointment) => {
          return (
            <HorizontalCard
              key={appointment.id}
              profilePic={appointment.healthcare_profile_picture}
              subject={capitalizeFirstLetter(appointment.healthcare_first_name)}
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
              color={containerColor(appointment)}
              onPressedCallback={() => {
                navigation.navigate("AppointmentDetailsScreen", {
                  appointment: appointment,
                });
              }}
            />
          );
        })}
        {pendingAppointment.map((appointment) => {
          return (
            <HorizontalCard
              key={appointment.id}
              profilePic={appointment.healthcare_profile_picture}
              subject={capitalizeFirstLetter(appointment.healthcare_first_name)}
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
              color={containerColor(appointment)}
              onPressedCallback={() => {
                navigation.navigate("AppointmentDetailsScreen", {
                  appointment: appointment,
                });
              }}
            />
          );
        })}
        {pendingAppointment.length == 0 && acceptedAppointment.length == 0 && (
          <Text variant="bodyLarge" style={{ marginBottom: 16 }}>
            You dont have any pending appointment
          </Text>
        )}
        <Text variant="titleLarge" style={{ marginVertical: 16 }}>
          Past Appointments
        </Text>
        {completedAppointment.length > 0 ? (
          completedAppointment.map((appointment) => {
            return (
              <HorizontalCard
                key={appointment.id}
                profilePic={appointment.healthcare_profile_picture}
                subject={capitalizeFirstLetter(
                  appointment.healthcare_first_name
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
                color={containerColor(appointment)}
                onPressedCallback={() => {
                  navigation.navigate("AppointmentDetailsScreen", {
                    appointment: appointment,
                  });
                }}
              />
            );
          })
        ) : (
          <Text variant="bodyLarge" style={{ marginBottom: 16 }}>
            You dont have any completed appointment
          </Text>
        )}
        <View style={{ marginBottom: 38 }} />
      </ScrollView>
      <View style={{ flex: 1, position: "absolute", bottom: 56, right: 16 }}>
        <FAB
          icon="calendar"
          size="small"
          label="Book Appointment"
          onPress={() => {
            navigation.navigate("BookAppointmentScreen");
          }}
        />
      </View>
    </View>
  );
}

export default AllAppointmentScreen;
