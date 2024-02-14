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
import { useTranslation } from "react-i18next";
import SideEffectChip from "../components/ui/SideEffectChip";

const TopTabs = createMaterialTopTabNavigator();

//Create Bottom Navigation Bar for Patient Module
const PatientDetailsTab = ({ patient }) => {
  const theme = useTheme();
  const { t } = useTranslation("healthcare");

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

  const ViewPatientAppointment = React.useCallback(() => {
    console.log("hahahha")
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
            {t("no_appointment_booked")}
          </Text>
        )}
      </ScrollView>
    );
  }, [patientAppointments]);

  const ViewPatientSideEffect = React.useCallback(() => {
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
            // console.log(patientSideEffects);
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
                  return <SideEffectChip symptom={symptom} key={j} />;
                })}
                <View style={{ marginRight: 16 }} />
              </ScrollView>
            );
          })
        ) : (
          <Text variant="bodyLarge" style={{ paddingHorizontal: 24 }}>
            {t("no_side_effects_reported")}
          </Text>
        )}
      </ScrollView>
    );
  }, [patientSideEffects]);

  function ViewPatientGoalTracker() {
    const marked = React.useMemo(() => {
      const markedDates = {};
      const startDate = new Date(patient.date_of_diagnosis);
      const today = new Date();

      const treatmentEndDate = new Date(startDate);
      treatmentEndDate.setMonth(
        treatmentEndDate.getMonth() + patient.treatment_duration_months
      );

      while (startDate <= treatmentEndDate) {
        const dateString = startDate.toISOString().slice(0, 10);
        const video = patientVideos.find(
          (v) =>
            v.uploaded_timestamp.toDate().toISOString().slice(0, 10) ===
            dateString
        );

        //Exclude date other than today
        if (video) {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.greenContainer,
            selectedTextColor: theme.colors.onBackground,
            disableTouchEvent: true,
          };
        } else if (!video && startDate <= today) {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.errorContainer,
            selectedTextColor: theme.colors.onBackground,
            disableTouchEvent: true,
          };
        } else {
          markedDates[dateString] = {
            selected: true,
            selectedColor: theme.colors.surfaceContainerHigh,
            selectedTextColor: theme.colors.onBackground,
            disableTouchEvent: true,
          };
        }
        startDate.setDate(startDate.getDate() + 1); // Move to the next date
      }
      return markedDates;
    }, [patientVideos]);

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
            color={theme.colors.greenContainer}
            text={t("video_submitted")}
          />
          <Legend
            color={theme.colors.errorContainer}
            text={t("video_missed")}
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
      initialRouteName="Appointment"
      backBehavior="none"
      style={{ margin: 0, padding: 0 }}
    >
      <TopTabs.Screen
        name={t("appointment")}
        component={ViewPatientAppointment}
      />
      <TopTabs.Screen
        name={t("side_effect")}
        component={ViewPatientSideEffect}
      />
      <TopTabs.Screen
        name={t("goal_tracker")}
        component={ViewPatientGoalTracker}
      />
    </TopTabs.Navigator>
  );
};

export default PatientDetailsTab;
