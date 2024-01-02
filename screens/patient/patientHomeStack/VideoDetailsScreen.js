import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { VIDEO_STATUS } from "../../../constants/constants";
import UploadVideoModal from "./UploadVideoModal";

export default function VideoDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentVideo = params.video;

  //Set the Appointment Status to change layout
  React.useLayoutEffect(() => {
    var headerTitle = "Video Details";
    if (currentVideo.status === VIDEO_STATUS.PENDING) {
      headerTitle = "Video Submitted";
    } else if (currentVideo.status === VIDEO_STATUS.ACCEPTED) {
      headerTitle = "Video Accepted";
    } else if (currentVideo.status === VIDEO_STATUS.REJECTED) {
      headerTitle = "Video Rejected";
    }

    navigation.setOptions({
      headerTitle: headerTitle,
    });
  });

  function PendingVideoCard() {
    return (
      <Text variant="bodyLarge" style={{ marginTop: 32 }}>
        The video is pending to be reviewed by the healthcare.
      </Text>
    );
  }

  function AcceptedVideoCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          Verified Date
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text variant="bodyLarge">
            {currentVideo.reviewed_timestamp.slice(0, 10)}
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
          The video has been <em>approved</em> by doctor.
        </Text>
      </View>
    );
  }

  function RejectedVideoCard() {
    return (
      <View>
        <Text variant="titleLarge" style={{ marginTop: 32 }}>
          Remarks
        </Text>
        <Text variant="bodyLarge" style={{ marginTop: 8 }}>
          {currentVideo.rejected_reason
            ? currentVideo.rejected_reason
            : "The healthcare didn't give any reason"}
        </Text>
        <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
          <Button mode="contained" onPress={handlePresentModalPress}>
            Resubmit
          </Button>
        </View>
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
        Date and time submitted
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text>
          {currentVideo.uploaded_timestamp.toDate().toISOString().slice(0, 10)}
        </Text>
        <Text>
          {currentVideo.uploaded_timestamp
            .toDate()
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
        </Text>
      </View>
      {currentVideo.status === VIDEO_STATUS.ACCEPTED && AcceptedVideoCard()}
      {currentVideo.status === VIDEO_STATUS.PENDING && PendingVideoCard()}
      {currentVideo.status === VIDEO_STATUS.REJECTED && RejectedVideoCard()}
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({});
