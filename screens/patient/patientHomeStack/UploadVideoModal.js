import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";

export default function UploadVideoModal({ bottomSheetModalRef }) {
  const { navigate } = useNavigation();
  const snapPoints = React.useMemo(() => ["30%"], []);
  const theme = useTheme();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const handleClosePress = () => bottomSheetModalRef.current.close();

  const pickImage = async () => {
    //No permission when launching image library
    setTimeout(() => setDialogVisible(true), 1000);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.3,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      navigate("PreviewVideoScreen", uri);
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
          <Text variant="labelLargeProminent">Upload Video</Text>
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
            Upload Video from Storage
          </Button>
          <Button mode="text" onPress={() => {}}>
            Take Video
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
      <LoadingIndicatorDialog
        visible={dialogVisible}
        close={() => {
          setDialogVisible(false);
        }}
      />
    </>
  );
}
