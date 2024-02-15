import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import { Dimensions, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export default function CameraScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation("common");
  const [isRecordingPage, setIsRecordingPage] = React.useState(false);

  //Permission
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [hasAudioPermission, setHasAudioPermission] = React.useState(null);

  //Camera State
  const [type, setType] = React.useState(CameraType.back);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [imagePadding, setImagePadding] = React.useState(0);
  const [ratio, setRatio] = React.useState("4:3"); // default is 4:3
  const [isRatioSet, setIsRatioSet] = React.useState(false);
  const cameraRef = React.useRef();

  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;

  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = ["16:9", "4:3"];

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = distance;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }

      
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      console.log("remainder is : " + remainder);
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

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
          isEditing ? "UserPreviewProfilePicScreen" : "PreviewProfilePicScreen",
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
        <Text>{t("no_access_camera")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.onBackground }}>
      <View
        style={{
          flex:1,
          backgroundColor: theme.colors.onBackground,
        }}
      >
        <Camera
          style={{
            flex: 1,
            marginTop: imagePadding,
            marginBottom: imagePadding,
          }}
          ratio={ratio}
          type={type}
          ref={cameraRef}
          onCameraReady={setCameraReady}
        >
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
