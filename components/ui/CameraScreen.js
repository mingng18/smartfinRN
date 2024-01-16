import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

export default function CameraScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute();
  const [isRecordingPage, setIsRecordingPage] = React.useState(false);

  //Permission
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [hasAudioPermission, setHasAudioPermission] = React.useState(null);

  //Camera State
  const [type, setType] = React.useState(CameraType.back);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const cameraRef = React.useRef();

  React.useLayoutEffect(() => {
    console.log("isEditing ? : " + params.isEditing);
    setIsRecordingPage(params.isVideo);
    setIsEditing(params.isEditing);
  });

  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        navigation.navigate(
          isEditing
            ? "UserPreviewProfilePicScreen"
            : "PreviewProfilePicScreen",
          {
            uri: data.uri,
            userType: params.userType ? params.userType : "",
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  const takeVideo = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (cameraRef) {
      try {
        setIsRecording(true);
        await cameraRef.current.recordAsync().then((data) => {
          console.log("Finish loading");
          navigation.navigate("PreviewVideoScreen", { uri: data.uri });
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const stopVideo = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }

  if (!hasCameraPermission || !hasAudioPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No access to the camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
          <IconButton
            icon="rotate-3d-variant"
            iconColor="white"
            size={40}
            style={{ position: "absolute", right: "3%", top: "3%" }}
            onPress={toggleCameraType}
          />
          <IconButton
            icon="chevron-left"
            iconColor="white"
            size={40}
            style={{ position: "absolute", left: "3%", top: "3%" }}
            onPress={() => navigation.goBack()}
          />
          {isRecordingPage ? (
            <>
              {isRecording ? (
                <IconButton
                  icon="stop-circle"
                  iconColor={theme.colors.primaryContainer}
                  size={80}
                  onPress={stopVideo}
                  style={{
                    position: "absolute",
                    alignSelf: "center",
                    bottom: "5%",
                  }}
                />
              ) : (
                <IconButton
                  icon="record-rec"
                  iconColor={theme.colors.primaryContainer}
                  size={100}
                  onPress={takeVideo}
                  style={{
                    position: "absolute",
                    alignSelf: "center",
                    bottom: "5%",
                  }}
                />
              )}
            </>
          ) : (
            <>
              <IconButton
                icon="circle-slice-8"
                iconColor="white"
                size={80}
                onPress={takePicture}
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  bottom: "5%",
                }}
              />
            </>
          )}
        </Camera>
      </View>
    </SafeAreaView>
  );
}
