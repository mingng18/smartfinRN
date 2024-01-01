import { View, StyleSheet, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import React, { useRef } from "react";
import ToDoCard from "../../components/ui/ToDoCard";
import CTAButton from "../../components/ui/CTAButton";
import UploadVideoModal from "./patientHomeStack/UploadVideoModal";
import {
  APPOINTMENT_STATUS,
  BLANK_PROFILE_PIC,
  VIDEO_STATUS,
} from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const videos = useSelector((state) => state.videoObject.videos);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] =
    React.useState(0);
  const [rejectedVideosCount, setRejectedVideosCount] = React.useState(0);
  const [hasAteMedicine, setHasAteMedicine] = React.useState(false);

  //Load all data with userId on the home page
  React.useEffect(() => {
    const fetchDataForPatient = async () => {
      const storedUid = await SecureStore.getItemAsync("uid");
      dispatch(fetchAppointments(storedUid));
      dispatch(fetchSideEffects(storedUid));
      dispatch(fetchVideos(storedUid));
    };

    fetchDataForPatient();
  }, [dispatch]);

  React.useEffect(() => {
    //Check the count of the pending appointment
    const calculatePendingAppointmentsCount = () => {
      const appointmentData = appointments.filter(
        (appointment) =>
          appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED
      );
      setPendingAppointmentsCount(appointmentData.length);
    };

    //Check the count of the rejected video
    const calculateRejectedVideosCount = () => {
      const vid = videos.filter(
        (video) => video.status === VIDEO_STATUS.REJECTED
      );
      setRejectedVideosCount(vid.length);
    };

    //Check if the patient has ate medicine today
    const calculateHasAteMedicine = () => {
      const vid = videos.filter((video) => {
        return (
          new Date(video.uploaded_timestamp).toISOString().slice(0, 10) ===
          new Date().toISOString().slice(0, 10)
        );
      });
      setHasAteMedicine(vid.length > 0);
    };

    calculatePendingAppointmentsCount();
    calculateRejectedVideosCount();
    calculateHasAteMedicine();
  }, [appointments, videos]);

  // modal ref
  const bottomSheetModalRef = useRef(null);

  // modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  return (
    <GestureHandlerRootView>
      {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
      <View
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: "100%",
        }}
      >
        {/* ================ HomeHeader =============== */}
        <View style={[styles.homeHeader]}>
          {/* TODO Change the name to the patients image */}
          <Image
            source={{ uri: BLANK_PROFILE_PIC }}
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
          <View style={[styles.headerText]}>
            <Text variant="bodyLarge">Hello, </Text>
            {/* TODO Change the name to the patients name */}
            <Text variant="headlineLarge">Arul</Text>
          </View>
        </View>
        {/* ================ TodoList ============== */}
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
              flexGrow: 1,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          ]}
        >
          <View
            style={[
              styles.toDoList,
              { backgroundColor: theme.colors.surfaceContainerLow },
            ]}
          >
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              To-Do List
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              {hasAteMedicine &&
              pendingAppointmentsCount == 0 &&
              rejectedVideosCount == 0 ? (
                <Text
                  variant="bodyLarge"
                  style={{
                    marginHorizontal: 16,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  Congratulations! Your to-do lists have been cleared!
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {!hasAteMedicine && (
                    <ToDoCard
                      title={"You haven’t take\nmedication yet today"}
                      icon="medical-bag"
                      count={0}
                      onPressedCallback={() =>
                        bottomSheetModalRef.current?.present()
                      }
                    />
                  )}
                  {pendingAppointmentsCount > 0 && (
                    <ToDoCard
                      title={"Appointment"}
                      icon="calendar"
                      count={pendingAppointmentsCount}
                      onPressedCallback={() =>
                        bottomSheetModalRef.current?.present()
                      }
                    />
                  )}
                  {rejectedVideosCount > 0 && (
                    <ToDoCard
                      title={"Video Rejected"}
                      icon="play"
                      count={rejectedVideosCount}
                      onPressedCallback={() => {}}
                    />
                  )}

                  {/* TODO Video Call Missed */}
                  {/* <ToDoCard
                  title="Video Call Missed"
                  icon="video"
                  count={1}
                  onPressedCallback={() => {}}
                /> */}
                  <View style={{ marginRight: 16 }} />
                </ScrollView>
              )}
            </View>
          </View>
          {/* ================== CTA buttons ============== */}
          <View
            style={[
              {
                paddingVertical: 16,
              },
            ]}
          >
            <Text
              variant="titleLarge"
              style={{ marginHorizontal: 16, marginTop: 16 }}
            >
              Are you up for something?
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              {/* TODO change the navigation screen for each */}
              <CTAButton
                icon="upload"
                title="Upload Video"
                color={theme.colors.primary}
                onPressedCallback={handlePresentModalPress}
              />
              <CTAButton
                icon="emoticon-sick"
                title="Report Side Effect"
                color={theme.colors.secondary}
                onPressedCallback={() => navigate("ReportSideEffectScreen")}
              />
              <CTAButton
                icon="calendar-blank"
                title="Make Appointment"
                color={theme.colors.tertiary}
                onPressedCallback={() => navigate("BookAppointmentScreen")}
                isLastItem={true}
              />
            </View>
          </View>
          {/* ================== TB Materials ================= */}
          <View
            style={[
              styles.tbMaterial,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              Tuberculosis Materials
            </Text>
            <Text
              variant="bodyLarge"
              style={{ marginHorizontal: 16, marginTop: 8 }}
            >
              Curious about tuberculosis?
            </Text>
            {/* TODO TB Materials */}
            <Button
              mode="contained"
              onPress={() => navigate("TuberculosisMaterialsScreen")}
              style={{ margin: 16 }}
            >
              Learn more about TB
            </Button>
          </View>
        </View>
      </View>
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
      {/* </ScrollView> */}
    </GestureHandlerRootView>
  );
}

export default PatientHomeScreen;

const styles = StyleSheet.create({
  homeHeader: {
    marginHorizontal: 16,
    marginTop: 56,
    flexDirection: "row",
    marginBottom: 32,
  },
  headerText: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
  },
  toDoList: {
    paddingTop: 16,
    borderRadius: 16,
  },
  tbMaterial: {
    paddingTop: 16,
  },
});
