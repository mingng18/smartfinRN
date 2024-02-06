import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, DeviceEventEmitter, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import {
  APPOINTMENT_STATUS,
  FIREBASE_COLLECTION,
  TREATMENT,
} from "../../../constants/constants";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import InformationChip from "../../../components/ui/InformationChip";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { editDocument } from "../../../util/firestoreWR";
import { useDispatch } from "react-redux";
import {
  updateAppointment,
  updatePendingAppointment,
} from "../../../store/redux/appointmentSlice";
import { useTranslation } from "react-i18next";

export default function HealthcareAppointmentDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentAppointment = params.appointment;
  const currentPatient = currentAppointment.patient_data;
  const dispatch = useDispatch();
  const { t } = useTranslation("healthcare");

  //Dialog
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState(false);
  const [roomId, setRoomId] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("appointment"),
    });
  });

  function containerColor(appointment) {
    return appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      ? theme.colors.secondaryContainer
      : theme.colors.surfaceContainer;
  }

  const onCallOrJoin = (meeting_room_id) => {
    if (meeting_room_id != null || meeting_room_id != "") {
      navigation.navigate("VideoCallScreen", {roomId: meeting_room_id, currentAppointment: currentAppointment});
    }
  };

  async function handleAccept() {
    const storedUid = await SecureStore.getItemAsync("uid");


      const characters = "abcdefghijklmnopqrstuvwxyz";
      let roomIdResult = "";
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomIdResult += characters.charAt(randomIndex);
      }
      setRoomId(roomIdResult);

    try {
      const updatedAppointment = {
        healthcare_id: storedUid,
        appointment_status: APPOINTMENT_STATUS.ACCEPTED,
        meeting_room_id: roomIdResult,
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
      Alert.alert(t("success"), t("appointment_successfully_accepted"));
      navigation.goBack();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log(`Error accepting appointment ${error}`);
      Alert.alert(t("error_occurred"), t("please_try_again_later"));
    }
  }

  function videoCall() {
    console.log("Video Calling this room : " + currentAppointment.meeting_room_id);
    onCallOrJoin(currentAppointment.meeting_room_id);
  }

  async function cancelAppointment() {
    if (reason === "") {
      setReasonError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t("error_occurred"), t("please_fill_in_reason"));
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
      Alert.alert(t("success"), t("appointment_successfully_cancelled"));
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
        status={t(currentAppointment.appointment_status)}
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
        {t("patient_information")}
      </Text>
      <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap" }}>
        <InformationChip
          text={currentPatient.nric_passport}
          icon={"card-account-details"}
          style={{ width: "60%" }}
          isBlur
        />
        <InformationChip
          text={t(currentPatient.gender)}
          icon={"gender-male-female"}
          style={{ width: "40%" }}
        />
        <InformationChip
          text={currentPatient.phone_number}
          icon={"phone"}
          style={{ width: "60%" }}
          isBlur
        />
        <InformationChip
          text={currentPatient.age}
          icon={"face-man"}
          style={{ width: "40%" }}
        />
        <InformationChip
          text={currentPatient.nationality}
          icon={"flag"}
          style={{ width: "60%" }}
        />
      </View>
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        {t("treatment_information")}
      </Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>
        {
          TREATMENT.find(
            (treatment) => treatment.value === currentPatient.treatment
          ).label
        }
      </Text>
      {/* Notes should be added after the video call */}
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        {t("appointment_notes")}
      </Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>
        {currentAppointment.notes
          ? currentAppointment.notes
          : t("no_notes_for_patient")}
      </Text>
      <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
        {currentAppointment.appointment_status ===
        APPOINTMENT_STATUS.PENDING ? (
          <Button mode="contained" onPress={() => handleAccept()}>
            {t("accept")}
          </Button>
        ) : (
          <>
            <Button mode="contained" onPress={() => videoCall()}>
              {t("video_call")}
            </Button>
            <Button
              mode="contained-tonal"
              style={{ marginRight: 16 }}
              onPress={() => showDialog()}
            >
              {t("cancel_appointment")}
            </Button>
          </>
        )}
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{t("are_you_sure")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t("provide_cancellation_reason")}</Text>
            <TextInput
              mode="outlined"
              style={{ marginTop: 8 }}
              placeholder={t("type_reason_here")}
              value={reason}
              onChangeText={(text) => setReason(text)}
              maxLength={100}
              error={reasonError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>{t("go_back")}</Button>
            <Button onPress={() => cancelAppointment()}>{t("submit")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
