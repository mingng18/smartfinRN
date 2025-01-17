import {
  View,
  StyleSheet,
  Image,
  RefreshControl,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
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
  FIREBASE_COLLECTION,
  LOGO_BLACK_TYPE,
  USER_TYPE,
  VIDEO_STATUS,
} from "../../constants/constants";
import {
  fetchAppointments,
  updateAppointment,
} from "../../store/redux/appointmentSlice";
import {
  fetchSideEffects,
  updateSideEffect,
} from "../../store/redux/sideEffectSlice";
import { fetchVideos } from "../../store/redux/videoSlice";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import CachedImage from "expo-cached-image";
import { fetchBookedAppointmentDates } from "../../store/redux/bookedAppointmentDateSlice";
import { useTranslation } from "react-i18next";
import { editDocument } from "../../util/firestoreWR";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state) => state.appointmentObject.appointments
  );
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  // const bookedAppointmentDates = useSelector(
  //   (state) => state.bookedAppointmentDateObject.bookedAppointmentDates
  // );
  const user = useSelector((state) => state.authObject);
  const videos = useSelector((state) => state.videoObject.videos);
  const { t } = useTranslation("patient");
  const scrollRef = React.useRef(null);

  const [pendingAppointmentsCount, setPendingAppointmentsCount] =
    React.useState(0);
  const [rejectedVideo, setRejectedVideo] = React.useState(null);
  const [hasAteMedicine, setHasAteMedicine] = React.useState(false);
  const [unviewedSideEffect, setUnviewedSideEffect] = React.useState(null);
  const [unviewedAppointment, setUnviewedAppointment] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // React.useLayoutEffect(() => {
  //   navigate("TuberculosisMaterialsScreen");
  // });

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
    dispatch(fetchBookedAppointmentDates({}));
  };

  React.useEffect(() => {
    //Check whether video today has been rejected
    const isVideoTodayRejected = () => {
      const vid = videos.find((video) => {
        const uploadedDate = new Date(video.uploaded_timestamp);
        const today = new Date();

        const isToday =
          uploadedDate.getFullYear() === today.getFullYear() &&
          uploadedDate.getMonth() === today.getMonth() &&
          uploadedDate.getDate() === today.getDate();

        return video.status === VIDEO_STATUS.REJECTED && isToday;
      });
      // console.log("rejected vid " + vid);

      if (vid == null || vid == undefined) {
        setRejectedVideo();
        return;
      }
      setRejectedVideo(vid);
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

    isVideoTodayRejected();
    calculateHasAteMedicine();

    dispatch(fetchBookedAppointmentDates({}));
    SplashScreen.hideAsync();
  }, [videos]);

  React.useEffect(() => {
    //Check the count of the pending appointment
    const calculatePendingAppointmentsCount = () => {
      const appointmentData = appointments.filter(
        (appointment) =>
          appointment.appointment_status === APPOINTMENT_STATUS.ACCEPTED ||
          appointment.appointment_status === APPOINTMENT_STATUS.PENDING
      );
      setPendingAppointmentsCount(appointmentData.length);
    };

    //Check whether any appointmnet remarks is unviewed
    const fetchUnviewAppointmentRemarks = () => {
      const unviewedAppointment = appointments.filter((appointment) => {
        return appointment.is_patient_viewed === false;
      });
      setUnviewedAppointment(unviewedAppointment);
    };

    calculatePendingAppointmentsCount();
    fetchUnviewAppointmentRemarks();
  }, [appointments]);

  React.useEffect(() => {
    //Check whether any side effects remarks is unviewed
    const fetchUnviewSideEffectRemarks = () => {
      const unviewedSideEffect = sideEffects.filter((sideEffect) => {
        return sideEffect.is_patient_viewed === false;
      });
      setUnviewedSideEffect(unviewedSideEffect);
    };

    fetchUnviewSideEffectRemarks();
  }, [sideEffects]);

  const pendingNumber = () => {
    var count = 0;
    if (pendingAppointmentsCount > 0) {
      count += pendingAppointmentsCount;
    }
    if (!hasAteMedicine) {
      count++;
    }
    if (rejectedVideo) {
      count++;
    }
    if (unviewedAppointment) {
      count += unviewedAppointment.length;
    }
    if (unviewedSideEffect) {
      count += unviewedSideEffect.length;
    }

    return count;
  };

  //Video Modal
  const bottomSheetModalRef = useRef(null);
  const handlePresentModalPress = () => {
    if (!rejectedVideo && hasAteMedicine) {
      return Alert.alert(
        t("already_uploaded_title"),
        t("already_uploaded_message"),
        [
          {
            text: t("continue_button"),
            onPress: () => bottomSheetModalRef.current?.present(),
          },
          {
            text: t("cancel_button"),
            onPress: () => {
              return;
            },
            style: "cancel",
          },
        ]
      );
    }
    return bottomSheetModalRef.current?.present();
  };

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
              paddingHorizontal: 16,
              flexDirection: "row",
              width: "100%",
              paddingBottom: 16,
              paddingTop: 8,
              alignItems: "center",
            },
          ]}
        >
          <View style={{ flexShrink: 1 }}>
            {user.profile_pic_url && user.profile_pic_url !== "" ? (
              <CachedImage
                source={{ uri: user.profile_pic_url }}
                cacheKey={getLastTenCharacters(user.profile_pic_url)}
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
                maxWidth: Dimensions.get("window").width - 32 - 74 - 74 - 32,
                marginHorizontal: 16,
              },
            ]}
          >
            <Text variant="bodyLarge">{t("hello_text")}</Text>
            <Text variant="headlineMedium" numberOfLines={2}>
              {capitalizeFirstLetter(user.first_name)}
            </Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Image source={LOGO_BLACK_TYPE} style={{ width: 74, height: 74 }} />
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
                {t("pending_text")}
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
                  {pendingNumber()}
                </Text>
              </View>
            </View>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              {hasAteMedicine &&
              pendingAppointmentsCount == 0 &&
              !rejectedVideo ? (
                <Text
                  variant="bodyLarge"
                  style={{
                    marginHorizontal: 16,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {t("congratulations_message")}
                </Text>
              ) : (
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {!hasAteMedicine && (
                    <ToDoCard
                      title={t("medication_not_taken_title")}
                      icon="medical-bag"
                      count={0}
                      onPressedCallback={() =>
                        // bottomSheetModalRef.current?.present()
                        navigate("CameraScreen", { isVideo: true })
                      }
                    />
                  )}
                  {pendingAppointmentsCount > 0 && (
                    <ToDoCard
                      title={t("appointment_title")}
                      icon="calendar"
                      count={pendingAppointmentsCount}
                      onPressedCallback={() => navigate("AllAppointmentScreen")}
                    />
                  )}
                  {rejectedVideo && (
                    <ToDoCard
                      title={t("video_rejected_title")}
                      icon="play"
                      count={"1"}
                      onPressedCallback={() => {
                        navigate("VideoDetailsScreen", {
                          video: rejectedVideo,
                        });
                      }}
                    />
                  )}
                  {unviewedSideEffect && (
                    <>
                      {unviewedSideEffect.map((sideEffect) => {
                        // console.log(
                        //   "SIDE EFFECT IS " + JSON.stringify(sideEffect)
                        // );
                        return (
                          <ToDoCard
                            key={sideEffect.id}
                            title={t("unviewed_side_effect")}
                            icon="eye-off"
                            count={0}
                            onPressedCallback={() => {
                              editDocument(
                                FIREBASE_COLLECTION.SIDE_EFFECT,
                                sideEffect.id,
                                { is_patient_viewed: true }
                              );
                              dispatch(
                                updateSideEffect({
                                  id: sideEffect.id,
                                  changes: { is_patient_viewed: true },
                                })
                              );
                              navigate("SideEffectDetailsScreen", {
                                sideEffect: sideEffect,
                              });
                              if (scrollRef.current) {
                                scrollRef.current.scrollTo({
                                  x: 0,
                                  animated: false,
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </>
                  )}
                  {unviewedAppointment && (
                    <>
                      {unviewedAppointment.map((appointment) => {
                        return (
                          <ToDoCard
                            key={appointment.id}
                            title={t("unviewed_appointment")}
                            icon="eye-off"
                            count={0}
                            onPressedCallback={() => {
                              editDocument(
                                FIREBASE_COLLECTION.APPOINTMENT,
                                appointment.id,
                                { is_patient_viewed: true }
                              );
                              dispatch(
                                updateAppointment({
                                  id: appointment.id,
                                  changes: { is_patient_viewed: true },
                                })
                              );
                              navigate("AppointmentDetailsScreen", {
                                appointment: appointment,
                              });
                              if (scrollRef.current) {
                                scrollRef.current.scrollTo({
                                  x: 0,
                                  animated: false,
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </>
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
          <View style={{ paddingVertical: 32 }}>
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              {t("up_for_something_text")}
            </Text>
            <View style={[{ flexDirection: "row", marginTop: 16 }]}>
              <CTAButton
                icon="upload"
                title={t("upload_video_title")}
                color={theme.colors.primary}
                onPressedCallback={
                  // handlePresentModalPress
                  () => navigate("CameraScreen", { isVideo: true })
                }
              />
              <CTAButton
                icon="emoticon-sick"
                title={t("side_effect_title")}
                color={theme.colors.secondary}
                onPressedCallback={() => {
                  navigate("ReportSideEffectScreen");
                }}
              />
              <CTAButton
                icon="calendar-blank"
                title={t("appointment_title")}
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
            <Text
              variant="titleLarge"
              style={{ marginHorizontal: 16, alignSelf: "center" }}
            >
              {t("materials_title")}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigate("TuberculosisMaterialsScreen")}
              style={{ marginHorizontal: 16, marginTop: 16 }}
            >
              {t("learn_more_button")}
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
    flexGrow: 1,
  },
  toDoList: {
    paddingTop: 16,
    borderRadius: 16,
  },
  tbMaterial: {
    paddingVertical: 24,
  },
});
