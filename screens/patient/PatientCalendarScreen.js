import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTheme, Text, Button, Divider } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import CustomCalendar from "../../components/ui/CustomCalendar";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { Pressable, View } from "react-native";
import { capitalizeFirstLetter } from "../../util/capsFirstWord";
import { useSelector } from "react-redux";

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
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const videos = useSelector((state) => state.videoObject.videos);

  React.useLayoutEffect(() => {
    //TODO populate data into video, appointment and sideEffect
    setAppointment(appointments);
    setSideEffect(sideEffects);
    setVideo(videos);
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
      ...video.map((item) => new Date(item.uploaded_timestamp)),
      ...appointment.map((item) => new Date(item.scheduled_timestamp)),
      ...sideEffect.map(
        (item) => new Date(item.side_effect_occuring_timestamp)
      ),
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
        new Date(item.uploaded_timestamp).toISOString().slice(0, 10) ===
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
        new Date(item.side_effect_occuring_timestamp)
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
              date={new Date(sideEffect.side_effect_occuring_timestamp)
                .toISOString()
                .slice(0, 10)}
              time={new Date(
                sideEffect.side_effect_occuring_timestamp
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              color={theme.colors.yellowContainer}
              onPressedCallback={() => {
                navigate("SideEffectDetailsScreen", {
                  sideEffect: sideEffect,
                });
              }}
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
        new Date(item.scheduled_timestamp).toISOString().slice(0, 10) ===
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
                date={new Date(appointment.scheduled_timestamp)
                  .toISOString()
                  .slice(0, 10)}
                time={new Date(
                  appointment.scheduled_timestamp
                ).toLocaleTimeString("en-US", {
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
          onPress={() => navigate("BookAppointmentScreen")}
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
    medical_checklist: "pending",
    rejected_reason: "pending",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
    reviewer_id: "pending",
    status: "pending",
    submitter_id: "pending",
    uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
    video_url: "pending",
  },
];

const appointmentData = [
  {
    appointment_status: "pending",
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "asiudbahfsas",
    remarks: "test",
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
  },
  {
    appointment_status: "accepted",
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "asiudbahfsas",
    remarks: "test",
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-23")),
  },
];

const sideEffectData = [
  {
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "X2U3YtMP1GQ9wo377rBpj8nrGPu2",
    remarks: "lol",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    se_status: "pending",
    severity: "danger",
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    symptoms: ["cough", "blood"],
  },
  {
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "X2U3YtMP1GQ9wo377rBpj8nrGPu2",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    remarks: "Drink more water",
    se_status: "reviewed",
    severity: "mild",
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    symptoms: ["cough", "nausea"],
  },
];
