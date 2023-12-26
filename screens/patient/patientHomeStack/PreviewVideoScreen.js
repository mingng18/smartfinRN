import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";

function PreviewVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { key, name, params, path } = route;
  const [video, setVideo] = React.useState("");
  const videoRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Upload Video",
    });
    setVideo(params);
  });

  const pickImage = async () => {
    //No permission when launching image library
    // setDialogVisible(true);
    setTimeout(() => setIsLoading(true), 1000);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // aspect: [4, 3],
      quality: 0.3,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
    setIsLoading(false);
  };

  //TODO Upload Video to firestore
  const handleVideoSubmit = () => {};

  return (
    <View
      style={{
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
        flex: 1,
        position: "relative", // Position the container relative to its normal position
      }}
    >
      <View
        style={{
          height: "60%",
          marginTop: 16,
          aspectRatio: 9 / 16,
          alignSelf: "center",
          borderRadius: 16,
          overflow: "hidden"
        }}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: video }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
        {isLoading && ( // Show loading indicator only when isLoading is true
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator color={theme.colors.primary} size={48} />
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row-reverse", marginTop: 40 }}>
        <Button mode="contained" onPress={handleVideoSubmit}>
          Upload
        </Button>
        <Button
          mode="contained-tonal"
          style={{ marginRight: 16 }}
          onPress={pickImage}
        >
          Choose Another Video
        </Button>
      </View>
    </View>
  );
}

export default PreviewVideoScreen;

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    height: "100%",
    aspectRatio: 9 / 16,
  },
  activityIndicatorContainer: {
    ...StyleSheet.absoluteFillObject, // Position the container absolutely to cover the entire video area
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for the loading overlay
  },
});
