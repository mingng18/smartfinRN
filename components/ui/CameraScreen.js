import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import { View, Image } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [type, setType] = React.useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = React.useState();
  const cameraRef = React.useRef();
  const theme = useTheme();
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        navigation.navigate("PreviewProfilePicScreen", data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!hasCameraPermission) {
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
        </Camera>
      </View>
    </SafeAreaView>
  );
}
