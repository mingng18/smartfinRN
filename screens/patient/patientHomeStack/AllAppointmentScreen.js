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

function AllAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "All Appointments",
    });

    //Query for all appointment, and seperate into
    // pending accpeted
    // past appointment
    //order by time
    // setCompleteAppointment(appointmentData);
    // setIncompleteAppointment(appointmentData);
  });

  const appointmentData = [
    {
      scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
      appointment_status: "pending",
    },
    {
      scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-23")),
      appointment_status: "accepted",
    },
  ];

  //Determine the container color
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
      <ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 16 }} />
        {appointmentData.map((appointment, i) => {
          //TODO query for the profilepic and name
          const profilePic = "../../assets/blank-profile-pic.png";
          const name = "bruh";
          return (
            <HorizontalCard
              key={i}
              profilePic={profilePic}
              subject={name}
              status={capitalizeFirstLetter(appointment.appointment_status)}
              date={appointment.scheduled_timestamp
                .toDate()
                .toISOString()
                .slice(0, 10)}
              time={appointment.scheduled_timestamp
                .toDate()
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              color={containerColor(appointment)}
              onPressedCallback={() => {
                navigation.navigate("AppointmentDetailsScreen", {
                  appointment: appointment,
                  profilePic: profilePic,
                  name: name,
                });
              }}
            />
          );
        })}
        <Text variant="titleLarge" style={{ marginVertical: 16 }}>
          Past Appointments
        </Text>
        {appointmentData.map((appointment, i) => {
          //TODO query for the profilepic and name
          const profilePic = "../../assets/blank-profile-pic.png";
          const name = "bruh";
          return (
            <HorizontalCard
              key={i}
              profilePic={profilePic}
              subject={name}
              status={capitalizeFirstLetter(appointment.appointment_status)}
              date={appointment.scheduled_timestamp
                .toDate()
                .toISOString()
                .slice(0, 10)}
              time={appointment.scheduled_timestamp
                .toDate()
                .toLocaleTimeString("en-US", {
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
