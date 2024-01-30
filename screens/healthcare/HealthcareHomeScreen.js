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
import { useTranslation } from "react-i18next";

function HealthcareHomeScreen() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation("healthcare");
  
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
  React.useEffect(() => {
    fetchVideoSubmittedThisMonth();
    fetchSideEffectSubmittedThisMonth();
  }, []);

  //Calculate total patients, videos to review, appointment, side effects alerts here
  React.useEffect(() => {
    const calculateAppointmentCount = () => {
      setAppointmentsCount(parseInt(pendingAppointments.length));
    };
    calculateAppointmentCount();
  }, [appointments]);

  React.useEffect(() => {
    const calculatePatientCount = () => {
      console.log("patients: ", patients.length);
      setPatientAmount(patients.length);
    };
    calculatePatientCount();
  }, [patients]);

  React.useEffect(() => {
    const calculateSideEffectsAlertCount = () => {
      setSideEffectsAlertCount(parseInt(sideEffects.length));
    };
    calculateSideEffectsAlertCount();
  }, [sideEffects]);

  React.useEffect(() => {
    const calculateVideosToBeReviewedCount = () => {
      if (videos.length === 0 || videos === undefined || videos === null) {
        setVideosToBeReviewedCount(0);
        return;
      }
      setVideosToBeReviewedCount(parseInt(videos.length));
    };
    calculateVideosToBeReviewedCount();
  }, [videos]);

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
            <Text variant="bodyLarge">{t("hello")}</Text>
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
            <Text variant="titleLarge">{t("pending")}</Text>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <HealthcareToDoCard
                title={t("total_patient")}
                icon="account-outline"
                count={patientAmount}
                onPressedCallback={() => navigate("AllPatientScreen")}
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={t("appointment")}
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
                title={t("review_videos_of_patients")}
                icon="video"
                count={videosToBeReviewedCount}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={t("review_patients_side_effects")}
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
              {t("are_you_up_for_something")}
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              {/* TODO change the navigation screen for each */}
              <CTAButton
                icon="video"
                title={t("video")}
                color={theme.colors.primary}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
              />
              <CTAButton
                icon="emoticon-sick"
                title={t("side_effect")}
                color={theme.colors.secondary}
                onPressedCallback={() => {
                  navigate("ReviewSideEffectScreen");
                }}
              />
              <CTAButton
                icon="calendar-blank"
                title={t("appointment")}
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
            {t("analytics")}
          </Text>
          <Text
            variant="labelLarge"
            style={{
              paddingTop: 4,
              marginHorizontal: 16,
            }}
          >
            {t("number_of_videos_submitted_this_month")}
          </Text>
          <VictoryChart theme={VictoryTheme.material}>
            {/* X Axis */}
            <VictoryAxis
              label={t("day")}
              style={{
                axisLabel: { padding: 30 },
              }}
            />
            {/* Y Axis */}
            <VictoryAxis
              dependentAxis
              label={t("number_of_videos")}
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
            {t("side_effects_submitted_this_month")}
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
              label={t("number_of_side_effects")}
              axisLabelComponent={<VictoryLabel dy={-16} />}
              tickFormat={(tick) => {
                return Number.isInteger(tick) ? tick.toString() : "";
              }}
            />
          </VictoryStack>
          <View style={{ flexDirection: "row-reverse" }}>
            <Legend text={t("grade_3")} color={theme.colors.error} />
            <Legend text={t("grade_2")} color={theme.colors.yellow} />
            <Legend text={t("grade_1")} color={theme.colors.primary} />
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
