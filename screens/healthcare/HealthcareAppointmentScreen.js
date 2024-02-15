import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Alert, DeviceEventEmitter, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";

import {
  APPOINTMENT_STATUS,
  BLANK_PROFILE_PIC,
  FIREBASE_COLLECTION,
  HORIZONTAL_CARD_TYPE,
  USER_TYPE,
} from "../../constants/constants";
import TextListButton from "../../components/ui/TextListButton";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../util/wordUtil";
import { editDocument } from "../../util/firestoreWR";
import {
  fetchAppointments,
  updateAppointment,
} from "../../store/redux/appointmentSlice";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";
import { useTranslation } from "react-i18next";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";

export default function HealthcareAppointmentScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { t } = useTranslation("healthcare");

  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const pendingAppointments = useSelector(
    (state) => state.appointmentObject.pendingAppointments
  );
  const today = new Date();

  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [callingAppointment, setcallingAppointment] = React.useState(null);
  const [callingAppointmentDate, setcallingAppointmentDate] =
    React.useState(null);
  const [callingAppointmentTime, setcallingAppointmentTime] =
    React.useState(null);
  const [callingAppointmentNotes, setCallingAppointmentNotes] =
    React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const showAppointmentNoteModal = () => setVisible(true);
  const hideAppointmentNoteModal = () => setVisible(false);

  function dismissAppointmentNotesModalHandler() {
    hideAppointmentNoteModal();
    setCallingAppointmentNotes("");
  }

  const onRefresh = React.useCallback(() => {
  //Load all data with userId on the home page
  const fetchDataForHealthcare = async () => {
    const storedUid = await SecureStore.getItemAsync("uid");
    dispatch(fetchPatientCollectionData());
    dispatch(
      fetchAppointments({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
    dispatch(
      fetchVideos({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
    dispatch(
      fetchSideEffects({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );

    // videoSubmittedGraphRef.current.fetchData();
    // sideEffectSubmittedGraphRef.current.fetchData();
  };

    setRefreshing(true);
    fetchDataForHealthcare();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  

  useEffect(() => {
    DeviceEventEmitter.removeAllListeners("onCallOrJoin");
  }, []);

  async function fetchAppointmentOnIntialize() {
    const storedUid = await SecureStore.getItemAsync("uid");
    dispatch(
      fetchAppointments({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
  }

  function showAppointmentNotesRecorderHandler(appointmentData) {
    console.log("checking here");
    console.log(appointmentData.scheduled_timestamp);
    showAppointmentNoteModal();
    setcallingAppointment(appointmentData);
    setcallingAppointmentDate(
      new Date(appointmentData.scheduled_timestamp).toISOString().slice(0, 10)
    );
    setcallingAppointmentTime(
      new Date(appointmentData.scheduled_timestamp).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      )
    );
  }

  const onCallOrJoin = async (meeting_room_id, appointment) => {
    if (meeting_room_id != null || meeting_room_id != "") {
      navigation.navigate("VideoCallScreen", {
        roomId: meeting_room_id,
        currentAppointment: appointment,
      });
    }

    fetchAppointmentOnIntialize();
  };

  async function submitAppointmentNotesHandler() {
    setIsLoading(true);
    try {
      const newAppointment = {
        ...callingAppointment,
        notes: callingAppointmentNotes,
      };
      await editDocument(
        FIREBASE_COLLECTION.APPOINTMENT,
        callingAppointment.id,
        { notes: callingAppointmentNotes }
      );
      dispatch(
        updateAppointment({
          id: callingAppointment.id,
          changes: newAppointment,
        })
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert(t("error_saving_appointment_note"), error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setIsLoading(false);
    hideAppointmentNoteModal();
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
          new Date(item.scheduled_timestamp).toISOString().slice(0, 10) ===
            date && item.appointment_status === APPOINTMENT_STATUS.ACCEPTED
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
                status={t(appointment.appointment_status)}
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
                  DeviceEventEmitter.addListener(
                    "onCallOrJoin",
                    (appointment) => {
                      navigation.navigate("AppointmentNotesScreen", {
                        appointment: appointment,
                      });
                      // showAppointmentNotesRecorderHandler(appointment);
                    }
                  );
                  navigation.navigate("HealthcareAppointmentDetailsScreen", {
                    appointment: appointment,
                  });
                }}
                cardType={
                  isPending
                    ? HORIZONTAL_CARD_TYPE.DEFAULT
                    : HORIZONTAL_CARD_TYPE.VIDEO_CALL_APPOINTMENT
                }
                iconOnPressedCallBack={async () => {
                  DeviceEventEmitter.addListener(
                    "onCallOrJoin",
                    (appointment) => {
                      navigation.navigate("AppointmentNotesScreen", {
                        appointment,
                      });
                      // showAppointmentNotesRecorderHandler(appointment);
                    }
                  );
                  onCallOrJoin(appointment.meeting_room_id, appointment);
                  // showAppointmentNotesRecorderHandler(appointment);
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
            ? t("no_accepted_appointment_on_this_day")
            : t("all_appointments_accepted")}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        automaticallyAdjustContentInsets={true}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* <Portal>
          <Modal
            visible={visible}
            onDismiss={() => dismissAppointmentNotesModalHandler()}
            contentContainerStyle={{
              backgroundColor: theme.colors.background,
              margin: 32,
              padding: 24,
            }}
          >
            <Text variant="titleLarge" style={{ marginVertical: 8 }}>
              {t("appointment_notes")}
            </Text>
            <View style={{ marginVertical: 16 }}>
              <Text variant="titleMedium" style={{ marginTop: 8 }}>
                {t("patient_information")}
              </Text>
              <Text variant="bodyLarge" style={{ marginVertical: 8 }}>
                {t("name")}: {callingAppointment?.patient_data.first_name}{" "}
                {callingAppointment?.patient_data.last_name}
              </Text>
              <Text variant="titleMedium" style={{ marginVertical: 8 }}>
                {t("appointment_information")}
              </Text>
              <Text variant="bodyLarge" style={{ marginVertical: 8 }}>
                {t("date")}: {callingAppointmentDate}
              </Text>
              <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
                {t("time")}: {callingAppointmentTime}
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 8 }}>
                {t("remarks_notes")}
              </Text>
              <TextInput
                mode="outlined"
                label={t("write_some_notes_here")}
                multiline={true}
                numberOfLines={5}
                style={{ marginVertical: 8 }}
                value={
                  callingAppointment !== null &&
                  (callingAppointment.notes !== null ||
                    callingAppointment.notes !== "")
                    ? callingAppointment.notes
                    : callingAppointmentNotes
                }
                onChangeText={(text) => setCallingAppointmentNotes(text)}
              />
              <Button
                mode="contained"
                onPress={() => {
                  submitAppointmentNotesHandler();
                }}
                style={{ marginTop: 8 }}
              >
                {t("save")}
              </Button>
            </View>
          </Modal>
        </Portal> */}
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
            [today.toISOString().slice(0, 10)]: {
              selected: true,
              selectedColor: theme.colors.background,
              selectedTextColor: theme.colors.onBackground,
            },
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
          <Text>{t("accepted")}</Text>
          <View
            style={{
              borderRadius: 24,
              width: 16,
              height: 16,
              backgroundColor: theme.colors.secondaryContainer,
              marginRight: 8,
            }}
          />
          <Text style={{ marginRight: 24 }}>{t("pending")}</Text>
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
          {t("appointment_requests")}
        </Text>
        <AppointmentHorizontalCard isPending={true} />
      </ScrollView>
      <LoadingIndicatorDialog
        visible={isLoading}
        close={() => {
          setIsLoading(false);
        }}
        title={t("saving_appointment_notes")}
        bodyText={t("please_wait")}
      />
    </View>
  );
}
