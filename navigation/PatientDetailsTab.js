import * as React from "react";
import { Icon, Text, useTheme } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import {
  fetchAppointmentsForPatient,
  fetchSideEffectsForPatient,
  fetchVideosForPatient,
} from "../util/firestoreWR";
import InformationChip from "../components/ui/InformationChip";
import { ScrollView } from "react-native-gesture-handler";
import { APPOINTMENT_STATUS, VIDEO_STATUS } from "../constants/constants";
import Legend from "../components/ui/Legend";
import { Calendar } from "react-native-calendars";

const TopTabs = createMaterialTopTabNavigator();

//Create Bottom Navigation Bar for Patient Module
const PatientDetailsTab = ({ patient }) => {
  const theme = useTheme();

  const [patientSideEffects, setPatientSideEffects] = React.useState([]);
  const [patientAppointments, setPatientAppointments] = React.useState([]);
  const [patientVideos, setPatientVideos] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setPatientSideEffects(await fetchSideEffectsForPatient(patient.id));
      setPatientAppointments(await fetchAppointmentsForPatient(patient.id));
      setPatientVideos(await fetchVideosForPatient(patient.id));
    };
    fetchData();
  }, [patient.id]);

  function ViewPatientAppointment() {
    return (
      <ScrollView
        nestedScrollEnabled
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
        }}
      >
        <View style={{ marginTop: 16 }} />
        {patientAppointments.length > 0 ? (
          patientAppointments.map((appointment, i) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  marginBottom: 16,
                  alignItems: "center",
                  backgroundColor: theme.colors.secondaryContainer,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                key={i}
              >
                <Icon
                  source={
                    appointment.appointment_status ===
                    APPOINTMENT_STATUS.ACCEPTED
                      ? "calendar"
                      : appointment.appointment_status ===
                        APPOINTMENT_STATUS.PENDING
                      ? "clock-outline"
                      : appointment.appointment_status ===
                        APPOINTMENT_STATUS.CANCELLED
                      ? "cancel"
                      : "check-bold"
                  }
                  size={32}
                />
                <Text variant="labelLarge" style={{ marginLeft: 16 }}>
                  {appointment.scheduled_timestamp
                    .toDate()
                    .toISOString()
                    .slice(0, 10)}
                </Text>
                <Text variant="labelMedium" style={{ marginLeft: 16 }}>
                  {new Date(
                    appointment.scheduled_timestamp.toDate()
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </Text>
              </View>
            );
          })
        ) : (
          <Text variant="bodyLarge" style={{ paddingHorizontal: 24 }}>
            This patient hasn't booked any appointment.
          </Text>
        )}
      </ScrollView>
    );
  }

  function ViewPatientSideEffect() {
    return (
      <ScrollView
        nestedScrollEnabled
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
        }}
      >
        <View style={{ marginTop: 16 }} />
        {patientSideEffects.length > 0 ? (
          patientSideEffects.map((sideEffect, i) => {
            console.log(patientSideEffects);
            return (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  flexDirection: "row",
                  paddingLeft: 16,
                  marginBottom: 16,
                }}
                key={i}
              >
                <View style={{ marginRight: 8 }}>
                  <Text variant="labelMedium">
                    {sideEffect.side_effect_occuring_timestamp
                      .toDate()
                      .toISOString()
                      .slice(0, 10)}
                  </Text>
                  <Text variant="labelMedium">
                    {new Date(
                      sideEffect.side_effect_occuring_timestamp.toDate()
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </Text>
                </View>
                {sideEffect.symptoms.map((symptom, j) => {
                  return <InformationChip key={j} text={symptom.label} />;
                })}
                <View style={{ marginRight: 16 }} />
              </ScrollView>
            );
          })
        ) : (
          <Text variant="bodyLarge" style={{ paddingHorizontal: 24 }}>
            This patient hasn't reported any side effects.
          </Text>
        )}
      </ScrollView>
    );
  }

  function ViewPatientGoalTracker() {
    const today = new Date();
    const startDate = new Date(patient.date_of_diagnosis);

    const marked = React.useMemo(() => {
      const markedDates = {};
      while (startDate <= today) {
        const dateString = startDate.toISOString().slice(0, 10);
        const video = patientVideos.find(
          (v) =>
            v.uploaded_timestamp.toDate().toISOString().slice(0, 10) ===
            dateString
        );

        //Exclude date other than today
        if (startDate < today) {
          if (!video || video.status === VIDEO_STATUS.REJECTED) {
            markedDates[dateString] = {
              selected: true,
              selectedColor: theme.colors.errorContainer,
              selectedTextColor: theme.colors.onBackground,
              disableTouchEvent: true,
            };
          } else if (video.status === VIDEO_STATUS.PENDING) {
            markedDates[dateString] = {
              selected: true,
              selectedColor: theme.colors.surfaceContainerHigh,
              selectedTextColor: theme.colors.onBackground,
              disableTouchEvent: true,
            };
          } else {
            markedDates[dateString] = {
              selected: true,
              selectedColor: theme.colors.primaryFixedDim,
              selectedTextColor: theme.colors.onBackground,
              disableTouchEvent: true,
            };
          }
        }
        startDate.setDate(startDate.getDate() + 1); // Move to the next date
      }
      return markedDates;
    }, [startDate, today, patientVideos]);

    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <View>
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
            markedDates={marked}
            // disabledByDefault
          />
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <Legend
            color={theme.colors.primaryFixedDim}
            text={"Video Accepted"}
          />
          <Legend color={theme.colors.errorContainer} text={"Video Missed"} />
          <Legend
            color={theme.colors.surfaceContainerHigh}
            text={"Video Pending"}
          />
        </View>
      </View>
    );
  }

  return (
    <TopTabs.Navigator
      screenOptions={{
        swipeEnabled: false,
        tabBarLabelStyle: {
          fontFamily: "DMSans-Regular",
          textTransform: "capitalize",
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      initialRouteName="ViewPatientAppointment"
      backBehavior="none"
      style={{ margin: 0, padding: 0 }}
    >
      <TopTabs.Screen name="Appointment" component={ViewPatientAppointment} />
      <TopTabs.Screen name="Side Effect" component={ViewPatientSideEffect} />
      <TopTabs.Screen name="Goal Tracker" component={ViewPatientGoalTracker} />
    </TopTabs.Navigator>
  );
};

export default PatientDetailsTab;
