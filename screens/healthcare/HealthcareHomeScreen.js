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
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import {
  BLANK_PROFILE_PIC,
  LOGO_NO_TYPE,
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDataForHealthcare();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // React.useLayoutEffect(() => {
  //   navigation.navigate("AllPatientScreen");
  // });

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
  };

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
          <Image source={LOGO_NO_TYPE} style={{ width: 74, height: 74 }} />
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
            <Text variant="titleLarge">To-Do List</Text>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <HealthcareToDoCard
                title={"Total Patient"}
                icon="account-outline"
                count={patientAmount}
                onPressedCallback={() => navigate("AllPatientScreen")}
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={"Review Videos"}
                icon="video"
                count={videosToBeReviewedCount}
                onPressedCallback={() => navigation.jumpTo("healthcareReview")}
                style={{ marginLeft: 8 }}
              />
            </View>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <HealthcareToDoCard
                title={"Appointment"}
                icon="calendar"
                count={appointmentsCount}
                onPressedCallback={() =>
                  navigation.jumpTo("healthcareAppointment")
                }
                style={{ marginRight: 8 }}
              />
              <HealthcareToDoCard
                title={"Side Effect"}
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
          {/* <Text
            variant="titleLarge"
            style={{
              paddingTop: 16,
              marginHorizontal: 16,
            }}
          >
            Analytics
          </Text> */}
        </View>
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
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
