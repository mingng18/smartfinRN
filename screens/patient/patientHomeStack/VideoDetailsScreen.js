import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { VIDEO_STATUS } from "../../../constants/constants";
import UploadVideoModal from "./UploadVideoModal";
import { useTranslation } from "react-i18next";

export default function VideoDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentVideo = params.video;
  const { t } = useTranslation("patient");

  //Set the Appointment Status to change layout
  React.useLayoutEffect(() => {
    let headerTitle = t("video_details");
    if (currentVideo.status === VIDEO_STATUS.PENDING) {
      headerTitle = t("video_submitted");
    } else if (currentVideo.status === VIDEO_STATUS.ACCEPTED) {
      headerTitle = t("video_accept");
    } else if (currentVideo.status === VIDEO_STATUS.REJECTED) {
      headerTitle = t("video_rejected");
    }

    navigation.setOptions({
      headerTitle: headerTitle,
    });
  });

  function PendingVideoCard() {
    return (
      <Text variant="bodyLarge" style={{ marginTop: 32 }}>
        {t("video_pending_review")}
      </Text>
    );
  }

  function AcceptedVideoCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          {t("verified_date")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text variant="bodyLarge">
            {currentVideo.reviewed_timestamp &&
              currentVideo.reviewed_timestamp.slice(0, 10)}
          </Text>
          <Text variant="bodyLarge">
            {new Date(currentVideo.reviewed_timestamp).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            )}
          </Text>
        </View>
        <Text variant="bodyLarge" style={{ marginTop: 32 }}>
          {t("video_approved_by_doctor")}
        </Text>
      </View>
    );
  }

  const isToday = () => {
    const uploadedDate = new Date(currentVideo.uploaded_timestamp);
    const today = new Date();

    return (
      uploadedDate.getFullYear() === today.getFullYear() &&
      uploadedDate.getMonth() === today.getMonth() &&
      uploadedDate.getDate() === today.getDate()
    );
  };

  function RejectedVideoCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          {t("remarks")}
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentVideo.rejected_reason
            ? currentVideo.rejected_reason
            : t("no_rejected_reason")}
        </Text>
        {/* {isToday() ? (
          <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
            <Button mode="contained" onPress={handlePresentModalPress}>
              {t("resubmit")}
            </Button>
          </View>
        ) : (
          <Text variant="bodyLarge" style={{ marginTop: 32 }}>
            {t("missed_resubmit_time")}
          </Text>
        )} */}
      </View>
    );
  }

  /// modal ref
  const bottomSheetModalRef = React.useRef(null);

  // modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        {t("date_time_submitted")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text variant="bodyLarge">
          {currentVideo.uploaded_timestamp &&
            currentVideo.uploaded_timestamp.slice(0, 10)}
        </Text>
        <Text variant="bodyLarge">
          {new Date(currentVideo.uploaded_timestamp).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }
          )}
        </Text>
      </View>
      {currentVideo.status === VIDEO_STATUS.ACCEPTED && AcceptedVideoCard()}
      {currentVideo.status === VIDEO_STATUS.PENDING && PendingVideoCard()}
      {currentVideo.status === VIDEO_STATUS.REJECTED && RejectedVideoCard()}
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
}
