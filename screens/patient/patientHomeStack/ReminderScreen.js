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
import { useTranslation } from "react-i18next";
import notifee from '@notifee/react-native';

export default function ReminderScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation("patient");

  const [videoReminder, setVideoReminder] = React.useState(true);
  const [appointmentReminder, setAppointmentReminder] = React.useState(true);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [calendarLocale, setCalendarLocale] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("reminder_header_title"),
    });

    const loadCalendarLocale = async () => {
      const locale = await SecureStore.getItemAsync("locale");
      console.log(locale);
      setCalendarLocale(locale);
    };

    loadCalendarLocale();
  }, [t]);

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
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

  

  const handleReminderSubmission = () => {
    //TODO submit new reminder
    Alert.alert(
      t("reminder_updated_title"),
      t("new_reminder_set_message", { hour, minute }),
      [
        {
          text: t("ok_button_text"),
          onPress: () => {
            onDisplayNotification();
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
              <Text variant="bodyLarge">{t("appointment_reminder_text")}</Text>
              <View pointerEvents="none">
                <Switch value={appointmentReminder} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => setVideoReminder(!videoReminder)}>
            <View style={styles.row}>
              <Text variant="bodyLarge">{t("video_upload_reminder_text")}</Text>
              <View pointerEvents="none">
                <Switch value={videoReminder} />
              </View>
            </View>
          </TouchableRipple>
        </View>
        {videoReminder && (
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
          </>
        )}
        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button mode="contained" onPress={handleReminderSubmission}>
            {t("update_button_text")}
          </Button>
        </View>
      </View>
      <TimePickerModal
        locale={calendarLocale}
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
