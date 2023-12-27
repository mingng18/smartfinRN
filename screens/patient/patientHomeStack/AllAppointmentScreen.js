import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { FAB, Portal, Text, useTheme } from "react-native-paper";
import {} from "../../../assets/blank-profile-pic.png";
import { BLANK_PROFILE_PIC } from "../../../constants/constants";
import HorizontalCard from "../../../components/ui/HorizontalCard";

function AllAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "All Appointments",
    });
  });

  const dummyData = [
    {
      profilePic: BLANK_PROFILE_PIC,
      subject: "Dr Nadzri",
      status: "Confirmed",
      date: "16 July 2023",
      time: "8:00pm - 9:00 pm",
      color: theme.colors.secondaryContainer,
    },
    {
      profilePic: BLANK_PROFILE_PIC,
      subject: "Dr Nadzri",
      status: "Confirmed",
      date: "16 July 2023",
      time: "8:00pm - 9:00 pm",
      color: theme.colors.secondaryContainer,
    },
  ];

  const pastdummyData = [
    {
      profilePic: BLANK_PROFILE_PIC,
      subject: "Dr Nadzri",
      date: "16 July 2023",
      time: "8:00 pm - 9:00 pm",
      color: theme.colors.surfaceContainer,
    },
    {
      profilePic: BLANK_PROFILE_PIC,
      subject: "Dr Nadzri",
      date: "16 July 2023",
      time: "8:00 pm - 9:00 pm",
      color: theme.colors.surfaceContainer,
    },
  ];

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
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
      {dummyData.map((data, index) => (
        <HorizontalCard
          key={index}
          {...data}
          onPressedCallback={() => {
            navigation.navigate("AppointmentDetailsScreen", data);
          }}
        />
      ))}
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        Past Appointments
      </Text>
      {pastdummyData.map((data, index) => (
        <HorizontalCard
          key={index}
          {...data}
          onPressedCallback={() => {
            navigation.navigate("AppointmentDetailsScreen", data);
          }}
        />
      ))}
    </View>
  );
}

export default AllAppointmentScreen;
