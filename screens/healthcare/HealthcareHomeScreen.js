import React from "react";
import HealthcareToDoCard from "../../components/ui/ToDoCard_Healthcare";
import CTAButton from "../../components/ui/CTAButton";
import CachedImage from "expo-cached-image";
import SideEffectSubmittedGraph from "../../components/ui/SideEffectSubmittedGraph";
import VideoSubmittedGraph from "../../components/ui/VideoSubmittedGraph";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../store/redux/appointmentSlice";
import { fetchSideEffects } from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import { fetchPatientCollectionData } from "../../store/redux/patientDataSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import {
  BLANK_PROFILE_PIC,
  LOGO_BLACK_TYPE,
  USER_TYPE,
} from "../../constants/constants";
import { useTranslation } from "react-i18next";
import SideEffectDetailsGraph from "../../components/ui/SideEffectDetailsGraph";

function HealthcareHomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { navigate } = navigation;
  const { t } = useTranslation("healthcare");
  const sideEffectSubmittedGraphRef = React.useRef();
  const videoSubmittedGraphRef = React.useRef();
  const sideEffectSymptomsGraphRef = React.useRef();

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
      fetchVideos({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );
    dispatch(
      fetchSideEffects({ userId: storedUid, userType: USER_TYPE.HEALTHCARE })
    );

    // videoSubmittedGraphRef.current.fetchData();
    // sideEffectSubmittedGraphRef.current.fetchData();
    sideEffectSymptomsGraphRef.current.fetchData();
  };

  //Calculate total patients, videos to review, appointment, side effects alerts here
  React.useEffect(() => {
    const calculateAppointmentCount = () => {
      setAppointmentsCount(parseInt(pendingAppointments.length));
    };
    calculateAppointmentCount();
  }, [appointments]);

  React.useEffect(() => {
    const calculatePatientCount = () => {
      setPatientAmount(patients.length);
    };
    calculatePatientCount();
  }, [patients]);

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

  React.useEffect(() => {
    const calculateSideEffectsAlertCount = () => {
      setSideEffectsAlertCount(parseInt(sideEffects.length));
    };
    calculateSideEffectsAlertCount();
    SplashScreen.hideAsync();
  }, [sideEffects]);

  //Fetch data for graph
  React.useEffect(() => {
    // videoSubmittedGraphRef.current.fetchData();
    // sideEffectSubmittedGraphRef.current.fetchData();
    sideEffectSymptomsGraphRef.current.fetchData();
  }, []);

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
            enabled={true}
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
              paddingHorizontal: 16,
              flexDirection: "row",
              width: "100%",
              paddingBottom: 16,
              paddingTop: 8,
              alignItems: "center",
            },
          ]}
        >
          <View style={{ width: 74 }}>
            {user.profile_pic_url && user.profile_pic_url !== "" ? (
              <CachedImage
                source={{ uri: user.profile_pic_url }}
                cacheKey={`${getLastTenCharacters(user.profile_pic_url)}`}
                defaultSource={BLANK_PROFILE_PIC}
                style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
              />
            ) : (
              <Image
                source={BLANK_PROFILE_PIC}
                style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
              />
            )}
          </View>
          <View
            style={[
              {
                flexGrow: 1,
                flexDirection: "column",
                maxWidth: Dimensions.get("window").width - 32 - 74 - 74 - 16,
                marginHorizontal: 8,
              },
            ]}
          >
            <Text variant="bodyLarge">{t("hello")}</Text>
            <Text variant="headlineMedium" numberOfLines={2}>
              {capitalizeFirstLetter(user.first_name)}
            </Text>
          </View>
          <View style={{ width: 74 }}>
            <Image source={LOGO_BLACK_TYPE} style={{ width: 74, height: 74 }} />
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text variant="titleLarge" style={{ marginRight: 16 }}>
                {t("pending")}
              </Text>
              <View
                style={{
                  backgroundColor: theme.colors.error,
                  borderRadius: 100,
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.onError }}>
                  {appointmentsCount +
                    videosToBeReviewedCount +
                    sideEffectsAlertCount}
                </Text>
              </View>
            </View>
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
          <View style={{ paddingVertical: 16 }}>
            <Text
              variant="titleLarge"
              style={{ marginHorizontal: 16, marginTop: 16 }}
            >
              {t("are_you_up_for_something")}
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
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
          {/* <VideoSubmittedGraph ref={videoSubmittedGraphRef} />
          <SideEffectSubmittedGraph ref={sideEffectSubmittedGraphRef} /> */}
          <SideEffectDetailsGraph ref={sideEffectSymptomsGraphRef} />
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
  homeHeader: {},
  headerText: {
    justifyContent: "center",
    marginHorizontal: 16,
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
