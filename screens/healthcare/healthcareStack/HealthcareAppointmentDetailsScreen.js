import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { APPOINTMENT_STATUS, FIREBASE_COLLECTION, TREATMENT } from "../../../constants/constants";
import { capitalizeFirstLetter } from "../../../util/capsFirstWord";
import InformationChip from "../../../components/ui/InformationChip";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { editDocument } from "../../../util/firestoreWR";
import { useDispatch } from "react-redux";
import {
  updateAppointment,
  updatePendingAppointment,
} from "../../../store/redux/appointmentSlice";

export default function HealthcareAppointmentDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentAppointment = params.appointment;
  const currentPatient = currentAppointment.patient_data;
  const dispatch = useDispatch();

  //Dialog
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Appointment",
    });
  });

  function containerColor(appointment) {
    return appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      ? theme.colors.secondaryContainer
      : theme.colors.surfaceContainer;
  }

  async function handleAccept() {
    const storedUid = await SecureStore.getItemAsync("uid");

    try {
      const updatedAppointment = {
        healthcare_id: storedUid,
        appointment_status: APPOINTMENT_STATUS.ACCEPTED,
      };

      await editDocument(
        FIREBASE_COLLECTION.APPOINTMENT,
        currentAppointment.id,
        updatedAppointment
      );
      dispatch(
        updatePendingAppointment({
          id: currentAppointment.id,
          changes: updatedAppointment,
        })
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Appointment successfully accepted.");
      navigation.goBack();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log(`Error accepting appointment ${error}`);
      Alert.alert("Error Occurred", `Please try again later `);
    }
  }

  function videoCall() {}

  async function cancelAppointment() {
    const storedUid = await SecureStore.getItemAsync("uid");
    if (reason === "") {
      setReasonError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error occured", "Please fill in reason");
    } else {
      const updatedAppointment = {
        remarks: reason,
        appointment_status: APPOINTMENT_STATUS.CANCELLED,
      };
      await editDocument(
        FIREBASE_COLLECTION.APPOINTMENT,
        currentAppointment.id,
        updatedAppointment
      );
      dispatch(
        updateAppointment({
          id: currentAppointment.id,
          changes: updatedAppointment,
        })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Appointment successfully cancelled.");
      navigation.goBack();
    }
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <HorizontalCard
        profilePic={currentPatient.profile_pic_url}
        subject={capitalizeFirstLetter(currentPatient.first_name)}
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
      />
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        Patient Information
      </Text>
      <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap" }}>
        <InformationChip
          text={capitalizeFirstLetter(currentPatient.gender)}
          icon={"gender-male-female"}
        />
        <InformationChip
          text={currentPatient.nric_passport}
          icon={"card-account-details"}
          isBlur
        />
        <InformationChip text={currentPatient.age} icon={"face-man"} />
        <InformationChip text={currentPatient.nationality} icon={"flag"} />
        <InformationChip
          text={currentPatient.phone_number}
          icon={"phone"}
          isBlur
        />
      </View>
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        Treatment Information
      </Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>
        {
          TREATMENT.find(
            (treatment) => treatment.value === currentPatient.treatment
          ).label
        }
      </Text>
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        Notes
      </Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>
        {currentPatient.notes
          ? currentPatient.notes
          : "This patient currently has no notes"}
      </Text>
      <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
        {currentAppointment.appointment_status ===
        APPOINTMENT_STATUS.PENDING ? (
          <Button mode="contained" onPress={() => handleAccept()}>
            Accept
          </Button>
        ) : (
          <>
            <Button mode="contained" onPress={() => videoCall()}>
              Video Call
            </Button>
            <Button
              mode="contained-tonal"
              style={{ marginRight: 16 }}
              onPress={() => showDialog()}
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Please provide reasons for the cancellation
            </Text>
            <TextInput
              mode="outlined"
              style={{ marginTop: 8 }}
              placeholder="Type your reason here"
              value={reason}
              onChangeText={(text) => setReason(text)}
              maxLength={100}
              error={reasonError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Go Back</Button>
            <Button onPress={() => cancelAppointment()}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
