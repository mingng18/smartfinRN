import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function UploadProfilePicModal({
  bottomSheetModalRef,
  userType,
}) {
  const { navigate } = useNavigation();
  const snapPoints = React.useMemo(() => ["30%"], []);
  const theme = useTheme();
  const { t } = useTranslation("common");

  const handleClosePress = () => bottomSheetModalRef.current.close();

  const pickImage = async () => {
    //No permission when launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      navigate("UserPreviewProfilePicScreen", { uri: uri, userType: userType });
    }
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
          <Text variant="labelLargeProminent">
            {t("upload_profile_picture")}
          </Text>
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
              pickImage();
              bottomSheetModalRef.current.close();
            }}
          >
            {t("upload_photo_storage")}
          </Button>
          <Button
            mode="text"
            onPress={() => {
              navigate("CameraScreen", { isEditing: true, userType: userType });
              bottomSheetModalRef.current.close();
            }}
          >
            {t("take_photo")}
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
    </>
  );
}
