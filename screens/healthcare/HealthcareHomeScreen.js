import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import React, { useRef } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { capitalizeFirstLetter } from "../../util/capsFirstWord";
import ToDoCard from "../../components/ui/ToDoCard";
import { BLANK_PROFILE_PIC } from "../../constants/constants";
import HealthcareToDoCard from "../../components/ui/ToDoCard_Healthcare";
import CTAButton from "../../components/ui/CTAButton";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";

function HealthcareHomeScreen() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const theme = useTheme();
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const pendingAppointments = useSelector(
    (state) => state.appointmentObject.pendingAppointments
  );
  const patients = useSelector((state) => state.patientDataObject.patients);
  const user = useSelector((state) => state.authObject);
  const videos = useSelector((state) => state.videoObject.videos);
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const [appointmentsCount, setAppointmentsCount] = React.useState(0);
  const [patientAmount, setPatientAmount] = React.useState(0);
  const [videosToBeReviewedCount, setVideosToBeReviewedCount] =
    React.useState(0);
  const [sideEffectsAlertCount, setSideEffectsAlertCount] = React.useState(0);


  React.useLayoutEffect(() => {
    navigation.navigate('AllPatientScreen')
  });

  //Load all data with userId on the home page
  React.useEffect(() => {
    const fetchDataForHealthcare = async () => {
      const storedUid = await SecureStore.getItemAsync("uid");
      console.log("the uid: " + storedUid);
      dispatch(fetchPatientCollectionData());
      dispatch(fetchAppointments({ patientId: storedUid, userType: "healthcare" }));
      dispatch(fetchSideEffects({ userId: storedUid, userType: "healthcare" }));
      dispatch(fetchVideos({ userId: storedUid, userType: "healthcare" }));
    };

    fetchDataForHealthcare();
  }, [dispatch]);

  //Calculate total patients, videos to review, appointment, side effects alerts here
  React.useEffect(() => {
    // console.log("the user : " + user.first_name + " " + user.last_name);
    // console.log("the profile pic : " + user.profile_pic_url);
    //{TODO calculate total patients, videos to review, appointment, side effects alerts here}
    const calculatePatientCount = () => {
      setPatientAmount(patients.length);
    };
    const calculateAppointmentCount = () => {
      console.log("appointments: ", appointments.length);
      console.log("pendingAppointments: ", pendingAppointments.length);
      setAppointmentsCount(parseInt(appointments.length));
    };
    const calculateVideosToBeReviewedCount = () => {
      console.log("videos: ", videos.length);
      if (videos.length === 0 || videos === undefined || videos === null) {
        setVideosToBeReviewedCount(0);
        return;
      }
      setVideosToBeReviewedCount(parseInt(videos.length));
    };
    const calculateSideEffectsAlertCount = () => {
      console.log("side effects: ", sideEffects.length);
      setSideEffectsAlertCount(parseInt(sideEffects.length));
    };
    calculatePatientCount();
    calculateAppointmentCount();
    calculateVideosToBeReviewedCount();
    calculateSideEffectsAlertCount();
  }, [appointments, videos, patients, sideEffects]);

  //modal ref
  const bottomSheetModalRef = useRef(null);

  //modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: "100%",
        }}
      >
        {/* ================ HomeHeader =============== */}
        <View style={[styles.homeHeader]}>
          <Image
            source={
              user.profile_pic_url
                ? { uri: user.profile_pic_url }
                : BLANK_PROFILE_PIC
            }
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
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
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                marginTop: 16,
                marginBottom: 8,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {
              /* !hasAteMedicine &&*/ <HealthcareToDoCard
                title={"Total Patient"}
                icon="account-outline"
                count={patientAmount}
                onPressedCallback={() => navigate("AllPatientScreen")}
              />
            }
            {
              /*pendingAppointmentsCount > 0 &&*/ <HealthcareToDoCard
                title={"Videos to Review"}
                icon="video"
                count={videosToBeReviewedCount}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
              />
            }
            <View style={{ marginRight: 16 }} />
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                marginTop: 8,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {
              /* !hasAteMedicine &&*/ <HealthcareToDoCard
                title={"Appointment"}
                icon="calendar"
                count={appointmentsCount}
                onPressedCallback={() =>
                  navigation.jumpTo("healthcareAppointment")
                }
              />
            }
            {
              /*pendingAppointmentsCount > 0 &&*/ <HealthcareToDoCard
                title={"Side Effect Alert"}
                icon="emoticon-sick-outline"
                count={sideEffectsAlertCount}
                onPressedCallback={() => navigate("ReviewSideEffectScreen")}
              />
            }
            <View style={{ marginRight: 16 }} />
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
                icon="video"
                title="Review Video"
                color={theme.colors.primary}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
              />
              <CTAButton
                icon="emoticon-sick"
                title="Review Side Effect"
                color={theme.colors.secondary}
                onPressedCallback={() => {
                  navigate("ReviewSideEffectScreen");
                }}
              />
              <CTAButton
                icon="calendar-blank"
                title="Review Appointment"
                color={theme.colors.tertiary}
                onPressedCallback={() => navigate("healthcareAppointment")}
                isLastItem={true}
              />
            </View>
          </View>
          {/* ================== Analytics ================= */}
          <View
            style={[
              {
                paddingTop: 16,
              },
            ]}
          >
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              Analytics
            </Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default HealthcareHomeScreen;

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
