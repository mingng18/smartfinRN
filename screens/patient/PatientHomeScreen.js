import {
  View,
  StyleSheet,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import React, { useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import ToDoCard from "../../components/ui/ToDoCard";
import CTAButton from "../../components/ui/CTAButton";
import UploadVideoModal from "./patientHomeStack/UploadVideoModal";
import {
  APPOINTMENT_STATUS,
  BLANK_PROFILE_PIC,
  USER_TYPE,
  VIDEO_STATUS,
} from "../../constants/constants";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import CachedImage from "expo-cached-image";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const user = useSelector((state) => state.authObject);
  const videos = useSelector((state) => state.videoObject.videos);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] =
    React.useState(0);
  const [rejectedVideosCount, setRejectedVideosCount] = React.useState(0);
  const [hasAteMedicine, setHasAteMedicine] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDataForPatient();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //Load all data with userId with pull to refresh
  const fetchDataForPatient = async () => {
    const storedUid = await SecureStore.getItemAsync("uid");
    dispatch(
      fetchAppointments({ userId: storedUid, userType: USER_TYPE.PATIENT })
    );
    dispatch(
      fetchSideEffects({ userId: storedUid, userType: USER_TYPE.PATIENT })
    );
    dispatch(fetchVideos({ userId: storedUid, userType: USER_TYPE.PATIENT }));
  };

  React.useEffect(() => {
    console.log("the diagnosis date: " + user.date_of_diagnosis);
    console.log("the user : " + user.first_name + " " + user.last_name);
    console.log("the profile pic : " + user.profile_pic_url);
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

  //Video Modal
  const bottomSheetModalRef = useRef(null);
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        edges={["right", "left", "top"]}
        style={{ backgroundColor: theme.colors.secondaryContainer }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          height: "100%",
          backgroundColor:
            Platform.OS === "ios"
              ? theme.colors.secondaryContainer
              : theme.colors.background,
        }}
      >
        {/* ================ HomeHeader =============== */}
        <View
          style={[
            styles.homeHeader,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          {user.profile_pic_url && (
            <CachedImage
              source={{ uri: user.profile_pic_url }}
              cacheKey={`${getLastTenCharacters(user.profile_pic_url)}-thumb`}
              defaultSource={BLANK_PROFILE_PIC}
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
          )}
          <View style={[styles.headerText]}>
            <Text variant="bodyLarge">Hello</Text>
            <Text variant="headlineLarge">
              {capitalizeFirstLetter(user.first_name)}
            </Text>
          </View>
        </View>
        {/* ================ TodoList ============== */}
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
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
                      onPressedCallback={() => navigate("AllAppointmentScreen")}
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
          <View style={{ paddingVertical: 16 }}>
            <Text
              variant="titleLarge"
              style={{ marginTop: 16, marginHorizontal: 16 }}
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
                onPressedCallback={() => {
                  navigate("ReportSideEffectScreen");
                }}
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
            <Button
              mode="contained"
              onPress={() => navigate("TuberculosisMaterialsScreen")}
              style={{ margin: 16 }}
            >
              Learn more about TB
            </Button>
          </View>
          <View
            style={[
              {
                backgroundColor: theme.colors.background,
                height: "100%",
              },
            ]}
          />
        </View>
      </ScrollView>
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
    </GestureHandlerRootView>
  );
}

export default PatientHomeScreen;

const styles = StyleSheet.create({
  homeHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingBottom: 32,
    paddingTop: 8,
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
