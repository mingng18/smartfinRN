import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import {
  BLANK_PROFILE_PIC,
  FIREBASE_COLLECTION,
  LOGO_BLACK_TYPE,
  SIDE_EFFECT_SEVERITY,
  USER_TYPE,
} from "../../constants/constants";
import HealthcareToDoCard from "../../components/ui/ToDoCard_Healthcare";
import CTAButton from "../../components/ui/CTAButton";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import CachedImage from "expo-cached-image";
import * as SecureStore from "expo-secure-store";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryStack,
  VictoryTheme,
} from "victory-native";
import { Timestamp } from "firebase/firestore";
import { fetchCollection } from "../../util/firestoreWR";
import Legend from "../../components/ui/Legend";

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
  const [refreshing, setRefreshing] = React.useState(false);
  const [videoAnalytic, setVideoAnalytic] = React.useState([]);
  const [sideEffectGrade1Analytic, setSideEffectGrade1Analytic] =
    React.useState([]);
  const [sideEffectGrade2Analytic, setSideEffectGrade2Analytic] =
    React.useState([]);
  const [sideEffectGrade3Analytic, setSideEffectGrade3Analytic] =
    React.useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDataForHealthcare();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  React.useLayoutEffect(() => {
    // navigation.navigate("AllPatientScreen");
  });

  //Load all data with userId on the home page
  const fetchDataForHealthcare = async () => {
    const storedUid = await SecureStore.getItemAsync("uid");
    dispatch(fetchPatientCollectionData());
    dispatch(
      fetchAppointments({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
    dispatch(
      fetchSideEffects({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
    dispatch(
      fetchVideos({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );

    fetchVideoSubmittedThisMonth();
    fetchSideEffectSubmittedThisMonth();
  };

  async function fetchVideoSubmittedThisMonth() {
    try {
      // const videos = await fetchCollection(FIREBASE_COLLECTION.VIDEO);
      const videoData = await fetchCollection(FIREBASE_COLLECTION.VIDEO);
      const videoCountByDay = new Map();
      const today = new Date();

      videoData.forEach((video) => {
        const videoDate = video.uploaded_timestamp.toDate();

        // console.log('lol ol ' + video.uploaded_timestamp);
        // console.log('lol ol ' + videoDate.getMonth());
        // console.log('lol ol ' + new Date().getMonth());

        if (
          videoDate.getMonth() === today.getMonth() &&
          videoDate.getFullYear() === today.getFullYear()
        ) {
          // console.log("yay");
          const day = videoDate.getDate();
          videoCountByDay.set(day, (videoCountByDay.get(day) || 0) + 1);
        }
      });

      // Convert the map to the desired format
      const formattedData = Array.from(videoCountByDay).map(([x, y]) => ({
        x,
        y,
      }));
      // formattedData.sort((a, b) => a.day - b.day);
      // console.log("video length is " + JSON.stringify(formattedData));
      setVideoAnalytic(formattedData);
    } catch (error) {
      throw new Error("Failed to fetch collection size: " + error.message);
    }
  }

  async function fetchSideEffectSubmittedThisMonth() {
    try {
      // const videos = await fetchCollection(FIREBASE_COLLECTION.VIDEO);
      const sideEffectData = await fetchCollection(
        FIREBASE_COLLECTION.SIDE_EFFECT
      );
      var grade1 = new Map();
      var grade2 = new Map();
      var grade3 = new Map();
      const today = new Date();

      sideEffectData.forEach((sideEffect) => {
        const sideEffectDate =
          sideEffect.side_effect_occuring_timestamp.toDate();

        console.log("lol ol " + sideEffectDate);
        console.log("lol ol " + sideEffectDate.getMonth());
        console.log("lol ol " + new Date().getMonth());

        if (
          sideEffectDate.getMonth() === today.getMonth() &&
          sideEffectDate.getFullYear() === today.getFullYear()
        ) {
          console.log("yayyy");
          const day = sideEffectDate.getDate();
          if (sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1) {
            grade1.set(day, (grade1.get(day) || 0) + 1);
          } else if (sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_2) {
            grade2.set(day, (grade2.get(day) || 0) + 1);
          } else if (sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_3) {
            grade3.set(day, (grade3.get(day) || 0) + 1);
          }
        }
      });

      grade1 = Array.from(grade1)
        .map(([x, y]) => ({ x, y }))
        .sort((a, b) => a.x - b.x);
      grade2 = Array.from(grade2)
        .map(([x, y]) => ({ x, y }))
        .sort((a, b) => a.x - b.x);
      grade3 = Array.from(grade3)
        .map(([x, y]) => ({ x, y }))
        .sort((a, b) => a.x - b.x);

      setSideEffectGrade1Analytic(grade1);
      setSideEffectGrade2Analytic(grade2);
      setSideEffectGrade3Analytic(grade3);

      // formattedData.sort((a, b) => a.day - b.day);
      console.log("sideEffect1 are " + JSON.stringify(grade1));
      console.log("sideEffect2 are " + JSON.stringify(grade2));
      console.log("sideEffect3 are " + JSON.stringify(grade3));
    } catch (error) {
      throw new Error("Failed to fetch collection size: " + error.message);
    }
  }

  //Calculate total patients, videos to review, appointment, side effects alerts here
  React.useEffect(() => {
    // console.log("the user : " + user.first_name + " " + user.last_name);
    // console.log("the profile pic : " + user.profile_pic_url);
    //{TODO calculate total patients, videos to review, appointment, side effects alerts here}
    const calculatePatientCount = () => {
      console.log("patients: ", patients.length);
      setPatientAmount(patients.length);
    };
    const calculateAppointmentCount = () => {
      // console.log("appointments: ", appointments.length);
      // console.log("pendingAppointments: ", pendingAppointments.length);
      setAppointmentsCount(parseInt(pendingAppointments.length));
    };
    const calculateVideosToBeReviewedCount = () => {
      // console.log("videos: ", videos.length);
      if (videos.length === 0 || videos === undefined || videos === null) {
        setVideosToBeReviewedCount(0);
        return;
      }
      setVideosToBeReviewedCount(parseInt(videos.length));
    };
    const calculateSideEffectsAlertCount = () => {
      // console.log("side effects: ", sideEffects.length);
      setSideEffectsAlertCount(parseInt(sideEffects.length));
    };
    calculatePatientCount();
    calculateAppointmentCount();
    calculateVideosToBeReviewedCount();
    calculateSideEffectsAlertCount();
  }, [appointments, videos, patients, sideEffects]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        edges={["right", "left", "top"]}
        style={{ backgroundColor: theme.colors.secondaryContainer }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
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
            {
              backgroundColor:
                Platform.OS === "android" && theme.colors.secondaryContainer,
            },
          ]}
        >
          {user.profile_pic_url && (
            <CachedImage
              source={{ uri: user.profile_pic_url }}
              cacheKey={`${getLastTenCharacters(user.profile_pic_url)}`}
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
          <Image source={LOGO_BLACK_TYPE} style={{ width: 74, height: 74 }} />
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
            <Text variant="titleLarge">Pending</Text>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <HealthcareToDoCard
                title={"Total Patient"}
                icon="account-outline"
                count={patientAmount}
                onPressedCallback={() => navigate("AllPatientScreen")}
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={"Appointment"}
                icon="calendar"
                count={appointmentsCount}
                onPressedCallback={() =>
                  navigation.jumpTo("healthcareAppointment")
                }
                style={{ marginLeft: 8 }}
              />
            </View>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <HealthcareToDoCard
                title={"Review Videos\nof Patients"}
                icon="video"
                count={videosToBeReviewedCount}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={"Review Patients\nSide Effects"}
                icon="emoticon-sick-outline"
                count={sideEffectsAlertCount}
                onPressedCallback={() => navigate("ReviewSideEffectScreen")}
                style={{ marginLeft: 8 }}
              />
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
                icon="video"
                title="Video"
                color={theme.colors.primary}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
              />
              <CTAButton
                icon="emoticon-sick"
                title="Side Effect"
                color={theme.colors.secondary}
                onPressedCallback={() => {
                  navigate("ReviewSideEffectScreen");
                }}
              />
              <CTAButton
                icon="calendar-blank"
                title="Appointment"
                color={theme.colors.tertiary}
                onPressedCallback={() => navigate("healthcareAppointment")}
                isLastItem={true}
              />
            </View>
          </View>
          {/* ================== Analytics ================= */}
          <Text
            variant="titleLarge"
            style={{
              paddingTop: 16,
              marginHorizontal: 16,
            }}
          >
            Analytics
          </Text>
          <Text
            variant="labelLarge"
            style={{
              paddingTop: 4,
              marginHorizontal: 16,
            }}
          >
            {`Number of videos submitted this month`}
          </Text>
          <VictoryChart theme={VictoryTheme.material}>
            {/* X Axis */}
            <VictoryAxis
              label="Day"
              style={{
                axisLabel: { padding: 30 },
              }}
            />
            {/* Y Axis */}
            <VictoryAxis
              dependentAxis
              label="Number of Videos"
              style={{
                axisLabel: { padding: 30 },
              }}
              tickFormat={(tick) => {
                return Number.isInteger(tick) ? tick.toString() : "";
              }}
            />
            <VictoryBar
              data={videoAnalytic}
              style={{
                data: { fill: theme.colors.primary },
              }}
            />
          </VictoryChart>
          <Text
            variant="labelLarge"
            style={{
              paddingTop: 32,
              marginHorizontal: 16,
            }}
          >
            {`Side effects submitted this month`}
          </Text>
          <VictoryStack
            theme={VictoryTheme.material}
            colorScale={[
              theme.colors.primary,
              theme.colors.yellow,
              theme.colors.error,
            ]}
          >
            <VictoryBar data={sideEffectGrade1Analytic} />
            <VictoryBar data={sideEffectGrade2Analytic} />
            <VictoryBar data={sideEffectGrade3Analytic} />
            <VictoryAxis />
            <VictoryAxis
              dependentAxis
              label="Number of Side Effects"
              axisLabelComponent={<VictoryLabel dy={-16} />}
              tickFormat={(tick) => {
                return Number.isInteger(tick) ? tick.toString() : "";
              }}
            />
          </VictoryStack>
          <View style={{ flexDirection: 'row-reverse' }}>
            <Legend text={"Grade 3"} color={theme.colors.error} />
            <Legend text={"Grade 2"} color={theme.colors.yellow} />
            <Legend text={"Grade 1"} color={theme.colors.primary} />
          </View>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
              marginBottom: 56,
              height: "100%",
            },
          ]}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default HealthcareHomeScreen;

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
    flexGrow: 1,
  },
  toDoList: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tbMaterial: {
    paddingTop: 16,
  },
});
