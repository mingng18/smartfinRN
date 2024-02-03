import notifee, { RepeatFrequency, TriggerType, TimestampTrigger } from "@notifee/react-native";

export default async function createSingleAppointmentNotification(appointment) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "appointment-channel",
      name: "Appointment Channel",
    });

    const date = new Date();
    date.setHours(11);
    date.setMinutes(31);

    // Create a time-based trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    // Create a trigger notification
    await notifee
      .createTriggerNotification(
        {
          id: "appointment",
          title: "Appointment Reminder",
          body: "Today at 11:30am",
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
        setAppointmentReminder(!appointmentReminder);
      });
}