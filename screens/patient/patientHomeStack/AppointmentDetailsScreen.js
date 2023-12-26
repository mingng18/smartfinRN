import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { APPOINTMENT_STATUS } from "../../../constants/constants";

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const [appointmentStatus, setAppointmentStatus] = React.useState();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  //Set the Appointment Status to change layout
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Appointment",
    });
    setAppointmentStatus(APPOINTMENT_STATUS.PENDING);
    console.log(params);
  });

  let firstMessage = "";
  let secondMessage = "";
  switch (appointmentStatus) {
    case APPOINTMENT_STATUS.APPROVED:
      firstMessage =
        "Your appointment has been confirmed by the doctor, please join the call on time.";
      secondMessage = "If you cannot make it, please request a cancellation.";
      break;
    case APPOINTMENT_STATUS.PENDING:
      firstMessage =
        "This appointment is currently pending approval from the doctor.";
      secondMessage =
        "If you cannot make it, please request a cancellation or you can reschedule it.";
      break;
    case APPOINTMENT_STATUS.CANCELLED:
      firstMessage = "This appointment has been cancelled by the healthcare.";
      break;
    case APPOINTMENT_STATUS.COMPLETED:
      firstMessage = "This appointment is completed.";
      break;
  }

  //TODO Handle Video Call
  const handleVideoCall = () => {};

  //TODO Reschedule Appointment
  const rescheduleAppointment = () => {};

  //TODO Cancel Appointment
  const cancelAppointment = () => {};
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <HorizontalCard {...params} />
      <Text variant="bodyLarge" style={{ marginTop: 16 }}>
        {firstMessage}
      </Text>
      <Text variant="bodyLarge" style={{ marginTop: 24 }}>
        {secondMessage}
      </Text>
      <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
        {appointmentStatus == APPOINTMENT_STATUS.PENDING ? (
          <>
            <Button mode="contained" onPress={rescheduleAppointment()}>
              Reschedule
            </Button>
            <Button
              mode="contained-tonal"
              style={{ marginRight: 16 }}
              onPress={() => {
                setDialogVisible(true);
              }}
            >
              Cancel Appointment
            </Button>
          </>
        ) : appointmentStatus == APPOINTMENT_STATUS.APPROVED ? (
          <>
            <Button mode="contained" onPress={handleVideoCall()}>
              Video Call
            </Button>
            <Button
              mode="contained-tonal"
              style={{ marginRight: 16 }}
              onPress={() => {
                setDialogVisible(true);
              }}
            >
              Cancel Appointment
            </Button>
          </>
        ) : (
          <></>
        )}
      </View>
      {appointmentStatus == APPOINTMENT_STATUS.COMPLETED && (
        <View>
          <Text variant="titleLarge" style={{ marginTop: 32 }}>
            Remarks/Notes
          </Text>
          <Text variant="bodyLarge" style={{ marginTop: 8 }}>
            If you cannot make it, please request a cancellation or you can
            reschedule it.
          </Text>
        </View>
      )}
      {appointmentStatus == APPOINTMENT_STATUS.CANCELLED && (
        <View>
          <Text variant="titleLarge" style={{ marginTop: 32 }}>
            Cancellation Reasons
          </Text>
          <Text variant="bodyLarge" style={{ marginTop: 8 }}>
            If you cannot make it, please request a cancellation or you can
            reschedule it.
          </Text>
        </View>
      )}
      <CancellationDialog
        visible={dialogVisible}
        close={() => {
          setDialogVisible(false);
        }}
        cancel={cancelAppointment()}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

const CancellationDialog = ({ visible, close, cancel }) => (
  <Portal>
    <Dialog onDismiss={close} visible={visible} dismissable={false}>
      <Dialog.Title>Cancel Appointment? </Dialog.Title>
      <Dialog.Content>
        <Text>Are you sure want to cancel the appointment?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close}>Go back</Button>
        <Button onPress={cancel}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);
