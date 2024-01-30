import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { Button, Portal, Text, useTheme } from "react-native-paper";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export default function UploadVideoModal({ bottomSheetModalRef }) {
  const { navigate } = useNavigation();
  const snapPoints = React.useMemo(() => ["30%"], []);
  const theme = useTheme();
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const { t } = useTranslation("patient");

  const handleClosePress = () => bottomSheetModalRef.current.close();

  const pickVideo = async () => {
    //No permission when launching image library
    setTimeout(() => setDialogVisible(true), 1000);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.3,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;

      navigate("PreviewVideoScreen", { uri: uri });
    }
    setDialogVisible(false);
  };

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="labelLargeProminent">{t("upload_video")}</Text>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              width: "90%",
              height: 1,
              marginVertical: 8,
            }}
          />
          <Button
            mode="text"
            onPress={() => {
              pickVideo();
              bottomSheetModalRef.current.close();
            }}
          >
            {t("upload_video_from_storage")}
          </Button>
          <Button
            mode="text"
            onPress={() => {
              navigate("CameraScreen", { isVideo: true });
              bottomSheetModalRef.current.close();
            }}
          >
            {t("take_video")}
          </Button>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              width: "90%",
              height: 1,
              marginVertical: 8,
            }}
          />
          <Button mode="text" onPress={handleClosePress}>
            {t("cancel")}
          </Button>
        </View>
      </BottomSheetModal>
      <LoadingIndicatorDialog
        visible={dialogVisible}
        close={() => {
          setDialogVisible(false);
        }}
        title={"Uploading Video"}
        bodyText={"Please wait while your video is being uploaded"}
      />
    </>
  );
}
