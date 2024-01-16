import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicatorDialog from "../../components/ui/LoadingIndicatorDialog";
import { useSelector } from "react-redux";
import { USER_TYPE } from "../../constants/constants";

export default function UploadProfilePicModal({
  bottomSheetModalRef,
  userType,
}) {
  const { navigate } = useNavigation();
  const snapPoints = React.useMemo(() => ["30%"], []);
  const theme = useTheme();
  //   const [dialogVisible, setDialogVisible] = React.useState(false);

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
          <Text variant="labelLargeProminent">Upload Profile Picture</Text>
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
            Upload Photo from Storage
          </Button>
          <Button
            mode="text"
            onPress={() => {
              navigate("CameraScreen", { isEditing: true, userType: userType });
              bottomSheetModalRef.current.close();
            }}
          >
            Take Photo
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
            Cancel
          </Button>
        </View>
      </BottomSheetModal>
    </>
  );
}
