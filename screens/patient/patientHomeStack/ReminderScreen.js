import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
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
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TimePickerModal } from "react-native-paper-dates";
import { useTranslation } from "react-i18next";
import notifee, { RepeatFrequency, TriggerType } from "@notifee/react-native";
import * as SecureStore from "expo-secure-store";
import { editDocument } from "../../../util/firestoreWR";
import { useSelector } from "react-redux";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";

export default function ReminderScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation("patient");
  const user = useSelector((state) => state.authObject);

  const [medicationReminder, setMedicationReminder] = React.useState(false);
  const [appointmentReminder, setAppointmentReminder] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [calendarLocale, setCalendarLocale] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("reminder_header_title"),
    });

    const loadCalendarLocale = async () => {
      SecureStore.getItemAsync("storedLocale").then((locale) => {
        console.log(locale + "Report side effect");
        setCalendarLocale(locale);
      });
    };

    const loadMedicationReminderTime = async () => {
      await SecureStore.getItemAsync("medicationTime").then((time) => {
        if (time) {
          const [hour, minute] = time.split("-");
          setHour(hour);
          setMinute(minute);
          console.log("Time is " + time);
        }
      });
    };

    loadCalendarLocale();
    loadMedicationReminderTime();

    notifee.getTriggerNotificationIds().then((ids) => {
      console.log("All trigger notifications: ", ids);
      if (ids.includes("medication")) {
        setMedicationReminder(true);
      }
      if (ids.includes("appointment")) {
        setAppointmentReminder(true);
      }
    });
  }, [t]);

  React.useEffect(() => {
    //Check if the patient has ate medicine today
    const retrievePermissions = async () => {
      // const settings = notifee.getNotificationSettings();
      // if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
      //   //Create timestamp trigger
      // } else {
      //   // Show some user information to educate them on what exact alarm permission is,
      //   // and why it is necessary for your app functionality, then send them to system preferences:
      //   await notifee.openAlarmPermissionSettings();
      // }
    };

    retrievePermissions();
  }, []);

  const scheduleNotifications = async () => {
    const startHour = 10; // Start hour (10:00 AM)
    const endHour = 21; // End hour (9:00 PM)

    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= startHour && currentHour <= endHour) {
      // Schedule notifications every hour within the specified time range
      const intervalMs = 60 * 60 * 1000; // 1 hour in milliseconds

      // Calculate the delay to the next hour
      const nextHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        currentHour + 1,
        0,
        0,
        0
      );
      const delayMs = nextHour.getTime() - now.getTime();

      // Schedule the first notification
      await notifee.createTriggerNotification({
        id: "hourly-notification",
        title: "Hourly Reminder",
        body: "This is an hourly reminder.",
        android: {
          channelId: "hourly-reminder-channel",
          smallIcon: "ic_notification",
        },
        ios: {
          sound: "default",
        },
      });

      await notifee.createTriggerNotification(
        {
          id: "medication",
          title: "Medication Alert",
          body: "Remember to take your medication",
          android: {
            channelId,
            // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: "default",
            },
          },
        },
        trigger
      );

      // Schedule subsequent notifications
      const intervalId = setInterval(async () => {
        await notifee.createNotification({
          id: "hourly-notification",
          title: "Hourly Reminder",
          body: "This is an hourly reminder.",
          android: {
            channelId: "hourly-reminder-channel",
            smallIcon: "ic_notification",
          },
          ios: {
            sound: "default",
          },
        });
      }, intervalMs);

      // Schedule the clear notification action to stop notifications after 9:00 PM
      setTimeout(() => {
        clearInterval(intervalId);
        notifee.cancelNotification("hourly-notification");
      }, delayMs);
    }
  };

  async function onCreateMedicationNotification() {
    setIsLoading(true);
    try {
      editDocument("patient", user.user_uid, {
        medication_reminder: !medicationReminder,
      });
      setMedicationReminder(!medicationReminder);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error setting reminder", "Please try again later");
      setIsLoading(false);
    }
    // if (!appointmentReminder) {
    //   // Request permissions (required for iOS)
    //   await notifee.requestPermission();

    //   // Create a channel (required for Android)
    //   const channelId = await notifee.createChannel({
    //     id: "medication-channel",
    //     name: "Medication Channel",
    //   });

    //   const date = new Date();
    //   date.setHours(Number(hour));
    //   date.setMinutes(Number(minute));

    //   const trigger = {
    //     type: TriggerType.TIMESTAMP,
    //     timestamp: date.getTime(),
    //     repeatFrequency: RepeatFrequency.DAILY,
    //   };

    //   await notifee.createTriggerNotification(
    //     {
    //       id: "medication",
    //       title: "Medication Alert",
    //       body: "Remember to take your medication",
    //       android: {
    //         channelId,
    //         // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
    //         // pressAction is needed if you want the notification to open the app when pressed
    //         pressAction: {
    //           id: "default",
    //         },
    //       },
    //     },
    //     trigger
    //   );
    // } else {
    //   setMedicationReminder(!medicationReminder);
    //   cancel("medication");
    // }
  }

  async function updateMedicationTime() {
    await SecureStore.setItemAsync("medicationTime", `${hour}-${minute}`);
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "medication-channel",
      name: "Medication Channel",
    });

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee
      .createTriggerNotification(
        {
          id: "medication",
          title: "Medication Alert",
          body: "Remember to take your medication",
          android: {
            channelId,
            // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: "default",
            },
          },
        },
        trigger
      )
      .then(() => {
        Alert.alert(t("reminder_updated_title"));
      });
  }

  async function onCreateAppointmentNotification() {
    setIsLoading(true);
    try {
      editDocument("patient", user.user_uid, {
        appointment_reminder: !appointmentReminder,
      });
      setAppointmentReminder(!appointmentReminder);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error setting appointment reminder", "Please try again later");
      setIsLoading(false);
    }
    // if (!appointmentReminder) {
    //   // Request permissions (required for iOS)
    //   await notifee.requestPermission();

    //   // Create a channel (required for Android)
    //   const channelId = await notifee.createChannel({
    //     id: "appointment-channel",
    //     name: "Appointment Channel",
    //   });

    //   const date = new Date();
    //   date.setHours(11);
    //   date.setMinutes(31);

    //   // Create a time-based trigger
    //   const trigger = {
    //     type: TriggerType.TIMESTAMP,
    //     timestamp: date.getTime(),
    //   };

    //   // Create a trigger notification
    //   await notifee
    //     .createTriggerNotification(
    //       {
    //         id: "appointment",
    //         title: "Appointment Reminder",
    //         body: "Today at 11:30am",
    //         android: {
    //           channelId,
    //           // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
    //           // pressAction is needed if you want the notification to open the app when pressed
    //           pressAction: {
    //             id: "default",
    //           },
    //         },
    //       },
    //       trigger
    //     )
    //     .then(() => {
    //       setAppointmentReminder(!appointmentReminder);
    //     });
    // } else {
    //   setAppointmentReminder(!appointmentReminder);
    //   cancel("appointment");
    // }
  }

  async function cancel(notificationId) {
    await notifee.cancelNotification(notificationId);
  }

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
          <TouchableRipple onPress={() => onCreateAppointmentNotification()}>
            <View style={styles.row}>
              <Text variant="bodyLarge">{t("appointment_reminder_text")}</Text>
              <View pointerEvents="none">
                <Switch value={appointmentReminder} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => onCreateMedicationNotification()}>
            <View style={styles.row}>
              <Text variant="bodyLarge">{t("video_upload_reminder_text")}</Text>
              <View pointerEvents="none">
                <Switch value={medicationReminder} />
              </View>
            </View>
          </TouchableRipple>
        </View>
        {medicationReminder && (
          <>
            <Text variant="titleLarge" style={{ marginTop: 32 }}>
              {t("video_upload_reminder_title")}
            </Text>
            <Pressable onPress={() => setTimePickerOpen(true)}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  style={{ marginTop: 8 }}
                  label={t("time_input_label")}
                  placeholder={t("time_input_placeholder")}
                  value={hour === "" ? "" : `${hour}:${minute}`}
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
            <Button
              mode="contained"
              onPress={() => updateMedicationTime()}
              style={{ alignSelf: "flex-end", marginTop: 40 }}
            >
              {t("update_button_text")}
            </Button>
          </>
        )}
      </View>
      <TimePickerModal
        locale={calendarLocale}
        visible={timePickerOpen}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        use24HourClock={false}
        defaultInputType="keyboard"
      />
      <LoadingIndicatorDialog
        visible={isLoading}
        title={t("updating_reminder")}
        bodyText={t("wait_while_updating_reminder")}
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
