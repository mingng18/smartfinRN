import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextComponent,
  View,
} from "react-native";
import {
  Button,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import React, { useState, useMemo } from "react";
import TextListButton from "../../../components/ui/TextListButton";
import { useNavigation } from "@react-navigation/native";
import { TimePickerModal } from "react-native-paper-dates";

export default function ReminderScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [videoReminder, setVideoReminder] = React.useState(true);
  const [appointmentReminder, setAppointmentReminder] = React.useState(true);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Reminder",
    });
  });

  //Time Picker
  const onDismiss = React.useCallback(() => {
    setTimePickerOpen(false);
  }, [setTimePickerOpen]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setTimePickerOpen(false);
      // Pad the hours and minutes with leading zeros if necessary
      const paddedHour = String(hours).padStart(2, "0");
      const paddedMinute = String(minutes).padStart(2, "0");
      setHour(paddedHour);
      setMinute(paddedMinute);
    },
    [setTimePickerOpen]
  );

  const handleReminderSubmission = () => {
    //TODO submit new reminder
    Alert.alert(
      "Reminder updated!",
      `New reminder set at ${hour} : ${minute} daily`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ marginTop: 16 }}>
          <TouchableRipple
            onPress={() => setAppointmentReminder(!appointmentReminder)}
          >
            <View style={styles.row}>
              <Text variant="bodyLarge">Appointment Reminder</Text>
              <View pointerEvents="none">
                <Switch value={appointmentReminder} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => setVideoReminder(!videoReminder)}>
            <View style={styles.row}>
              <Text variant="bodyLarge">Video Upload Reminder</Text>
              <View pointerEvents="none">
                <Switch value={videoReminder} />
              </View>
            </View>
          </TouchableRipple>
        </View>
        {videoReminder && (
          <>
            <Text variant="titleLarge" style={{ marginTop: 32 }}>
              Set the time for video upload reminder
            </Text>
            <Pressable onPress={() => setTimePickerOpen(true)}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  style={{ marginTop: 8 }}
                  label="Time"
                  placeholder="Starting date of the symptoms"
                  value={hour == "" ? `` : `${hour} : ${minute}`}
                  onChangeText={(value) => setDate(value)}
                  right={
                    <TextInput.Icon
                      icon="clock"
                      color={theme.colors.onBackground}
                    />
                  }
                  maxLength={100}
                />
              </View>
            </Pressable>
          </>
        )}
        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button
            mode="contained"
            onPress={() => {
              handleReminderSubmission();
            }}
          >
            Update
          </Button>
        </View>
      </View>
      <TimePickerModal
        locale="en-GB"
        visible={timePickerOpen}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        use24HourClock={false}
        defaultInputType="keyboard"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});
