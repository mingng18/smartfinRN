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

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentAppointment = params.appointment;
  const dispatch = useDispatch();
  // const [dialogVisible, setDialogVisible] = React.useState(false);

  //Set the Appointment Status to change layout
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Appointment",
    });
  });

  //Determine the container color
  function containerColor(appointment) {
    return appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      ? theme.colors.secondaryContainer
      : theme.colors.surfaceContainer;
  }

  function PendingCard() {
    return (
      <View>
        <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment is currently pending approval from the doctor.
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          If you cannot make it, please request a cancellation or you can
          reschedule it.
        </Text>
        <View
          style={{
            flexDirection: "row-reverse",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {/* <Button
            mode="contained"
            onPress={rescheduleAppointment}
            style={{ marginLeft: 16, marginBottom: 16 }}
          >
            Reschedule
          </Button> */}
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16, marginBottom: 16 }}
            onPress={() => {
              Alert.alert(
                "Cancel Appointment?",
                "Are you sure want to cancel the appointment?",
                [
                  {
                    text: "Go Back",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Cancel",
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
            Cancel Appointment
          </Button>
        </View>
      </View>
    );
  }

  function AcceptedCard() {
    return (
      <View>
        <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          Your appointment has been confirmed by the doctor, please join the
          call on time.
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 24 }}>
          If you cannot make it, please request a cancellation.
        </Text>
        <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
          <Button
            mode="contained"
            onPress={handleVideoCall()}
            style={{ marginLeft: 16, marginBottom: 16 }}
          >
            Video Call
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16, marginBottom: 16 }}
            onPress={() => {
              Alert.alert(
                "Cancel Appointment?",
                "Are you sure want to cancel the appointment?",
                [
                  {
                    text: "Go Back",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Cancel",
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
            Cancel Appointment
          </Button>
        </View>
      </View>
    );
  }

  function CompletedCard() {
    return (
      <View>
        <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment is completed.
        </Text>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          Remarks/Notes
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentAppointment.remarks === ""
            ? "No remarks"
            : currentAppointment.remarks}
        </Text>
      </View>
    );
  }

  function CancelledCard() {
    return (
      <View>
        <Text variant="bodyLarge" style={{ marginTop: 16 }}>
          This appointment has been cancelled by the healthcare.
        </Text>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          Cancellation Reasons
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentAppointment.remarks === ""
            ? "No remarks"
            : currentAppointment.remarks}
        </Text>
      </View>
    );
  }

  //TODO Handle Video Call
  const handleVideoCall = () => {};

  //TODO Reschedule Appointment
  const rescheduleAppointment = () => {
    navigation.navigate("BookAppointmentScreen", { isReschedule: true });
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
        Alert.alert("Error cancelling", "Please try again later");
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
          currentAppointment.healthcare_first_name === ""
            ? "Awaiting Confirmation"
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
