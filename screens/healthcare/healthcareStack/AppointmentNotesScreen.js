import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useTransition } from "react";
import { Keyboard, KeyboardAvoidingView, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { editDocument } from "../../../util/firestoreWR";
import { useTranslation } from "react-i18next";
import { updateAppointment } from "../../../store/redux/appointmentSlice";
import { FIREBASE_COLLECTION } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function AppointmentNotesScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const { t } = useTranslation("healthcare");
  const dispatch = useDispatch();

  const currentAppointment = params.appointment;
  const [remark, setRemark] = React.useState(currentAppointment.remarks);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("video_call_ended"),
    });
  });

  function submitButtonHandler() {
    editDocument(FIREBASE_COLLECTION.APPOINTMENT, currentAppointment.id, {
      remarks: remark,
    }).then(() => {
      dispatch(updateAppointment({ ...currentAppointment, remarks: remark }));
      navigation.navigate("HealthcareBottomNavBar");
    });
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.background,
        flexDirection: "column",
      }}
    >
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <HorizontalCard
            profilePic={currentAppointment.patient_data.profile_pic}
            subject={currentAppointment.patient_data.name}
            status={t("completed")}
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
            color={theme.colors.secondaryContainer}
          ></HorizontalCard>
          <Text variant="titleLarge" style={{marginTop:16}}>{t("remarks_notes")}</Text>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={10}
            style={{ marginVertical: 8, paddingVertical: 16 }}
            placeholder={t("write_some_notes_here")}
            value={remark}
            onChangeText={setRemark}
          ></TextInput>
          <View
            style={{justifyContent: "flex-end", alignItems: "flex-end", marginTop: 16}}
          >
            <Button
              mode="contained"
              onPress={() => submitButtonHandler()}
            >
              {t("submit")}
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
