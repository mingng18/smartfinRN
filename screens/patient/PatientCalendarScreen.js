import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  useTheme,
  Text,
  Chip,
  Button,
  IconButton,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Timestamp } from "firebase/firestore";
import CustomCalendar from "../../components/ui/CustomCalendar";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { Pressable, View } from "react-native";
import { capitalizeFirstLetter } from "../../util/capsFirstWord";

function PatientCalendarScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();

  //Data state
  const [highlightedDates, setHighlightedDates] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");

  const [video, setVideo] = React.useState([]);
  const [appointment, setAppointment] = React.useState([]);
  const [sideEffect, setSideEffect] = React.useState([]);

  const [isVideo, setIsVideo] = React.useState(true);
  const [isAppointment, setIsAppointment] = React.useState(true);
  const [isSideEffect, setIsSideEffect] = React.useState(true);

  React.useLayoutEffect(() => {
    //TODO populate data into video, appointment and sideEffect
    setVideo(videoData);
    setAppointment(appointmentData);
    setSideEffect(sideEffectData);
  });

  //Refresh the calendar when there is new data
  React.useEffect(() => {
    if (video || appointment || sideEffect) {
      setHighlightedDates(combinedDates(video, appointment, sideEffect));
    }
    setSelectedDate(new Date().toISOString().slice(0, 10));
  }, [video, appointment, sideEffect]);

  //Combine all data to be pass to calendar
  const combinedDates = (video, appointment, sideEffect) => {
    const allDates = [
      ...video.map((item) => item.uploaded_timestamp.toDate()),
      ...appointment.map((item) => item.scheduled_timestamp.toDate()),
      ...sideEffect.map((item) => item.side_effect_occuring_timestamp.toDate()),
    ];

    const substringedDates = Array.from(
      new Set(allDates.map((date) => date.toISOString().slice(0, 10)))
    );

    return substringedDates;
  };

  //The Horizontal Card for video
  //including pending, accepted, rejected
  const VideoHorizontalCard = () => {
    const matchedVideo = video.find(
      (item) =>
        item.uploaded_timestamp.toDate().toISOString().slice(0, 10) ===
        selectedDate
    );

    if (matchedVideo) {
      return (
        <Pressable
          style={{
            backgroundColor:
              matchedVideo.status === "accepted"
                ? theme.colors.primaryFixedDim
                : matchedVideo.status === "pending"
                ? theme.colors.surfaceContainerHigh
                : theme.colors.errorContainer,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
          onPress={() => {
            navigate("VideoDetailsScreen", { video: matchedVideo });
          }}
        >
          <Text variant="labelLarge">
            {matchedVideo.status === "accepted"
              ? "Video submitted and accepted"
              : matchedVideo.status === "pending"
              ? "Video submitted and pending approval"
              : "Video Rejected"}
          </Text>
          {matchedVideo.rejected_reason && (
            <Text variant="bodyMedium">{matchedVideo.rejected_reason}</Text>
          )}
        </Pressable>
      );
    }
  };

  //The Horizontal Card for side effect
  //including severe, moderate, mild
  const SideEffectHorizontalCard = () => {
    const matchedSideEffects = sideEffect.filter(
      (item) =>
        item.side_effect_occuring_timestamp
          .toDate()
          .toISOString()
          .slice(0, 10) === selectedDate
    );

    if (matchedSideEffects.length > 0) {
      return (
        <>
          {matchedSideEffects.map((sideEffect, i) => (
            <HorizontalCard
              key={i}
              subject={capitalizeFirstLetter(sideEffect.severity)}
              date={sideEffect.side_effect_occuring_timestamp
                .toDate()
                .toISOString()
                .slice(0, 10)}
              time={sideEffect.side_effect_occuring_timestamp
                .toDate()
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              color={theme.colors.yellowContainer}
            />
          ))}
        </>
      );
    }
  };

  //The Horizontal Card for appointment effect
  //including pending, approved, completed, cancelled
  const AppointmentHorizontalCard = () => {
    const matchedAppointment = appointment.filter(
      (item) =>
        item.scheduled_timestamp.toDate().toISOString().slice(0, 10) ===
        selectedDate
    );

    if (matchedAppointment.length > 0) {
      return (
        <>
          {matchedAppointment.map((appointment, i) => {
            const profilePic = "../../assets/blank-profile-pic.png";
            const name = "bruh";
            return (
              <HorizontalCard
                key={i}
                profilePic={profilePic}
                subject={name}
                status={capitalizeFirstLetter(appointment.appointment_status)}
                date={appointment.scheduled_timestamp
                  .toDate()
                  .toISOString()
                  .slice(0, 10)}
                time={appointment.scheduled_timestamp
                  .toDate()
                  .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                color={theme.colors.secondaryContainer}
                onPressedCallback={() => {
                  navigate("AppointmentDetailsScreen", {
                    appointment: appointment,
                    profilePic: profilePic,
                    name: name,
                  });
                }}
              />
            );
          })}
        </>
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      <CustomCalendar
        highlightedDates={highlightedDates}
        setHighlightedDates={setHighlightedDates}
        video={video}
        appointment={appointment}
        sideEffect={sideEffect}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isVideo={isVideo}
        setIsVideo={setIsVideo}
        isAppointment={isAppointment}
        setIsAppointment={setIsAppointment}
        isSideEffect={isSideEffect}
        setIsSideEffect={setIsSideEffect}
      />
      <Divider style={{ marginTop: 32 }} />
      <ScrollView
        style={{ paddingTop: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Button
          mode="contained"
          icon="calendar"
          labelStyle={{ color: theme.colors.onSurface }}
          style={{
            backgroundColor: theme.colors.surfaceContainerHigh,
            marginBottom: 16,
          }}
        >
          Book an appointment
        </Button>
        {isVideo && VideoHorizontalCard()}
        {isSideEffect && SideEffectHorizontalCard()}
        {isAppointment && AppointmentHorizontalCard()}
        <View style={{ marginBottom: 54 }}></View>
      </ScrollView>
    </View>
  );
}

export default PatientCalendarScreen;

// Dummy data
const videoData = [
  {
    uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
    status: "pending",
  },
  {
    uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    status: "rejected",
  },
];

const appointmentData = [
  {
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    appointment_status: "pending",
  },
  {
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-23")),
    appointment_status: "accepted",
  },
];

const sideEffectData = [
  {
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    severity: "danger",
  },
  {
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    severity: "mild",
  },
];
