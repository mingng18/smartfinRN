import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import {
  APPOINTMENT_STATUS,
  HORIZONTAL_CARD_TYPE,
} from "../../../constants/constants";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { editDocument } from "../../../util/firestoreWR";
import { useDispatch } from "react-redux";
import { updateAppointment } from "../../../store/redux/appointmentSlice";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentAppointment = params.appointment;
  const dispatch = useDispatch();
  const { t } = useTranslation("patient");

  // const [dialogVisible, setDialogVisible] = React.useState(false);

  //Set the Appointment Status to change layout
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("appointment_title"),
    });
  }, [t]);

  //Determine the container color
  function containerColor(appointment) {
    return appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      ? theme.colors.secondaryContainer
      : theme.colors.surfaceContainer;
  }

  function PendingCard() {
    return (
      <View>
        {/* <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment is currently pending approval from the doctor.
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          If you cannot make it, please request a cancellation or you can
          reschedule it.
        </Text> */}
        <View
          style={{
            flexDirection: "row-reverse",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <Button
            mode="contained"
            onPress={rescheduleAppointment}
            style={{ marginLeft: 16, marginBottom: 16 }}
          >
            {t("reschedule_button_text")}
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16, marginBottom: 16 }}
            onPress={() => {
              Alert.alert(
                t("cancel_appointment_title"),
                t("cancel_appointment_message"),
                [
                  {
                    text: t("no_button_text"),
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: t("yes_button_text"),
                    onPress: () => {
                      cancelAppointment();
                    },
                    style: "cancel",
                  },
                ],
                {
                  cancelable: false,
                }
              );
            }}
          >
            {t("cancel_appointment_text")}
          </Button>
        </View>
      </View>
    );
  }

  function AcceptedCard() {
    return (
      <View>
        {/* <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          Your appointment has been confirmed by the doctor, please join the
          call on time.
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          If you cannot make it, please request a cancellation.
        </Text> */}
        <View
          style={{
            flexDirection: "row-reverse",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <Button
            mode="contained"
            onPress={handleVideoCall}
            style={{ marginLeft: 16, marginBottom: 16 }}
          >
            {t("video_call_button_text")}
          </Button>
          <Button
            mode="contained-tonal"
            onPress={rescheduleAppointment}
            style={{ marginLeft: 16, marginBottom: 16 }}
          >
            {t("reschedule_button_text")}
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16, marginBottom: 16 }}
            onPress={() => {
              Alert.alert(
                t("cancel_appointment_title"),
                t("cancel_appointment_message"),
                [
                  {
                    text: t("go_back_button_text"),
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: t("cancel_button_text"),
                    onPress: () => {
                      cancelAppointment();
                    },
                    style: "cancel",
                  },
                ],
                {
                  cancelable: false,
                }
              );
            }}
          >
            {t("cancel_appointment_text")}
          </Button>
        </View>
      </View>
    );
  }

  function CompletedCard() {
    return (
      <View>
        {/* <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment is completed.
        </Text> */}
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          {t("remarks_notes_text")}
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentAppointment.remarks === ""
            ? t("no_remarks_text")
            : currentAppointment.remarks}
        </Text>
      </View>
    );
  }

  function CancelledCard() {
    return (
      <View>
        {/* <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment has been cancelled by the healthcare.
        </Text> */}
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          {t("cancellation_reasons_text")}
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentAppointment.remarks === ""
            ? t("no_remarks_text")
            : currentAppointment.remarks}
        </Text>
      </View>
    );
  }

  const onCallOrJoin = (meeting_room_id) => {
    if (meeting_room_id != null || meeting_room_id != "") {
      navigation.navigate("JoinVideoCallScreen", {roomId: meeting_room_id});
    }
  };

  //TODO Handle Video Call
  const handleVideoCall = async () => {
    console.log("Video Call Pressed on appointment: " + currentAppointment.id);
    console.log("roomID " + currentAppointment.meeting_room_id);


    if (currentAppointment.meeting_room_id) {
      if (
        currentAppointment.meeting_room_id === "" ||
        currentAppointment.meeting_room_id === null||
        currentAppointment.meeting_room_id === undefined
      ) {
        // console.log(`Room ${roomId} does not exist.`);
        Alert.alert("The meeting room does not exist.");
        return;
      } else {
        onCallOrJoin( currentAppointment.meeting_room_id);
      }
    } else {
      Alert.alert("Provide a valid Room ID.");
    }
  };

  //TODO Reschedule Appointment
  const rescheduleAppointment = () => {
    navigation.navigate("BookAppointmentScreen", {
      isReschedule: true,
      lastAppointment: currentAppointment,
    });
  };

  const cancelAppointment = async () => {
    const updatedAppointment = {
      appointment_status: APPOINTMENT_STATUS.CANCELLED,
    };
    await editDocument("appointment", currentAppointment.id, updatedAppointment)
      .then(() => {
        dispatch(
          updateAppointment({
            id: currentAppointment.id,
            changes: updatedAppointment,
          })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
      })
      .catch((error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t("error_cancelling_text"), t("try_again_later_text"));
        console.log("Error cancelling" + error);
      });
  };

  const determineCardType = (status) => {
    if (status === APPOINTMENT_STATUS.CANCELLED) {
      return HORIZONTAL_CARD_TYPE.NO_PIC;
    }
    if (status === APPOINTMENT_STATUS.PENDING) {
      return HORIZONTAL_CARD_TYPE.NO_PIC;
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <HorizontalCard
        profilePic={currentAppointment.healthcare_profile_picture}
        subject={capitalizeFirstLetter(
          currentAppointment.healthcare_first_name === "" ||
            currentAppointment.healthcare_first_name === null ||
            currentAppointment.healthcare_first_name === undefined
            ? t("appointment_title")
            : currentAppointment.healthcare_first_name
        )}
        status={capitalizeFirstLetter(currentAppointment.appointment_status)}
        date={new Date(currentAppointment.scheduled_timestamp)
          .toISOString()
          .slice(0, 10)}
        time={new Date(
          currentAppointment.scheduled_timestamp
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
        color={containerColor(currentAppointment)}
        cardType={determineCardType(currentAppointment.appointment_status)}
      />
      {currentAppointment.appointment_status === APPOINTMENT_STATUS.PENDING &&
        PendingCard()}
      {currentAppointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED &&
        AcceptedCard()}
      {currentAppointment.appointment_status === APPOINTMENT_STATUS.COMPLETED &&
        CompletedCard()}
      {currentAppointment.appointment_status === APPOINTMENT_STATUS.CANCELLED &&
        CancelledCard()}
    </View>
  );
}
