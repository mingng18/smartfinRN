import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { useTheme, Text, Divider } from "react-native-paper";
import CustomCalendar from "../../components/ui/CustomCalendar";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { Pressable, View } from "react-native";
import { capitalizeFirstLetter } from "../../util/wordUtil";
import { useSelector } from "react-redux";
import {
  APPOINTMENT_STATUS,
  CALENDAR_ENTITIES,
  HORIZONTAL_CARD_TYPE,
  SIDE_EFFECT_SEVERITY,
} from "../../constants/constants";
import UploadVideoModal from "./patientHomeStack/UploadVideoModal";
import { useTranslation } from "react-i18next";

function PatientCalendarScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const bottomSheetModalRef = useRef(null);
  const { t } = useTranslation("patient");

  //Data state
  const [highlightedDates, setHighlightedDates] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [currentSelected, setCurrentSelected] = React.useState(
    CALENDAR_ENTITIES.VIDEO
  );
  // const [isVideo, setIsVideo] = React.useState(true);
  // const [isAppointment, setIsAppointment] = React.useState(true);
  // const [isSideEffect, setIsSideEffect] = React.useState(true);
  const user = useSelector((state) => state.authObject);
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const videos = useSelector((state) => state.videoObject.videos);

  //Refresh the calendar when there is new data
  React.useEffect(() => {
    console.log("appointment " + appointments);
    console.log("videos  " + videos);
    console.log("sideEffects " + sideEffects);
    if (videos || appointments || sideEffects) {
      setHighlightedDates(combinedDates(videos, appointments, sideEffects));
    }
    setSelectedDate(new Date().toISOString().slice(0, 10));
  }, [videos, appointments, sideEffects]);

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
    const matchedVideo = videos.find(
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
            console.log(JSON.stringify(matchedVideo));
            navigate("VideoDetailsScreen", { video: matchedVideo });
          }}
        >
          <Text variant="labelLarge">
            {matchedVideo.status === "accepted"
              ? t("video_accepted")
              : matchedVideo.status === "pending"
              ? t("video_pending")
              : t("video_rejected")}
          </Text>
          {matchedVideo.rejected_reason && (
            //TODO translate reason
            <Text variant="bodyMedium">{matchedVideo.rejected_reason}</Text>
          )}
        </Pressable>
      );
    } else {
      const startDate = new Date(user.date_of_diagnosis);
      const treatmentEndDate = new Date(startDate);
      treatmentEndDate.setMonth(
        treatmentEndDate.getMonth() + user.treatment_duration_months
      );
      const today = new Date();
      // console.log("startDate:", startDate);
      // console.log("treatmentEndDate:", treatmentEndDate);
      // console.log("today:", today);
      // console.log("selectedDate:", new Date(selectedDate));

      if (today.getDate() === new Date(selectedDate).getDate()) {
        return (
          <Pressable onPress={() => navigate("CameraScreen", { isVideo: true })}>
            <View
              style={{
                backgroundColor: theme.colors.surfaceContainerHigh,
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text variant="labelLarge">{t("you_have_yet_to_upload")}</Text>
            </View>
          </Pressable>
        );
      } else if (
        today.getTime() > new Date(selectedDate).getTime() &&
        new Date(selectedDate).getTime() >= startDate.getTime()
      ) {
        return (
          <View
            style={{
              backgroundColor: theme.colors.errorContainer,
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text variant="labelLarge">{t("you_missed_your_medication")}</Text>
          </View>
        );
      } else if (
        today.getTime() <= new Date(selectedDate).getTime() &&
        new Date(selectedDate).getTime() <= treatmentEndDate.getTime()
      ) {
        return (
          <View
            style={{
              backgroundColor: theme.colors.surfaceContainerHigh,
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text variant="labelLarge">
              {t("come_back_later_to_upload_video")}
            </Text>
          </View>
        );
      }
    }
  };

  //The Horizontal Card for side effect
  //including severe, moderate, mild
  const SideEffectHorizontalCard = () => {
    const matchedSideEffects = sideEffects.filter((item) => {
      // console.log(item.side_effect_occuring_timestamp)
      return (
        new Date(item.side_effect_occuring_timestamp)
          .toISOString()
          .slice(0, 10) === selectedDate
      );
    });

    if (matchedSideEffects.length > 0) {
      return (
        <>
          {matchedSideEffects.map((sideEffect, i) => (
            <HorizontalCard
              key={i}
              subject={t(sideEffect.severity)}
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
              color={
                sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
                  ? theme.colors.surfaceContainer
                  : theme.colors.errorContainer
              }
              onPressedCallback={() => {
                navigate("SideEffectDetailsScreen", {
                  sideEffect: sideEffect,
                });
              }}
              cardType={HORIZONTAL_CARD_TYPE.NO_PIC}
            />
          ))}
        </>
      );
    }
  };

  //The Horizontal Card for appointment effect
  //including pending, approved, completed, cancelled
  const AppointmentHorizontalCard = () => {
    // console.log(appointments);
    const matchedAppointment = appointments.filter(
      (item) =>
        new Date(item.scheduled_timestamp).toISOString().slice(0, 10) ===
        selectedDate
    );

    if (matchedAppointment.length > 0) {
      return (
        <>
          {matchedAppointment.map((appointment, i) => {
            // console.log('card name' + appointment.healthcare_first_name);
            return (
              <HorizontalCard
                key={i}
                profilePic={appointment.healthcare_profile_picture}
                subject={capitalizeFirstLetter(
                  appointment.healthcare_first_name === "" ||
                    appointment.healthcare_first_name === null ||
                    appointment.healthcare_first_name === undefined
                    ? t("appointment_title")
                    : appointment.healthcare_first_name
                )}
                status={t(appointment.appointment_status)}
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
                  });
                }}
                cardType={
                  appointment.appointment_status ===
                    APPOINTMENT_STATUS.PENDING && HORIZONTAL_CARD_TYPE.NO_PIC
                }
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
        video={videos}
        appointment={appointments}
        sideEffect={sideEffects}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentSelected={currentSelected}
        setCurrentSelected={setCurrentSelected}
      />
      <Divider style={{ marginTop: 32 }} />
      <ScrollView
        style={{ paddingTop: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {currentSelected === CALENDAR_ENTITIES.VIDEO && VideoHorizontalCard()}
        {currentSelected === CALENDAR_ENTITIES.SIDE_EFFECT &&
          SideEffectHorizontalCard()}
        {currentSelected === CALENDAR_ENTITIES.APPOINTMENT &&
          AppointmentHorizontalCard()}
        <View style={{ marginBottom: 54 }}></View>
      </ScrollView>
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
}

export default PatientCalendarScreen;
