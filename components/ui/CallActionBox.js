import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Icon, useTheme } from "react-native-paper";

const CallActionBox = ({ switchCamera, toggleMute, toggleCamera, endCall }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const theme = useTheme();

  const onToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };
  const onToggleMicrophone = () => {
    toggleMute();
    setIsMicOn(!isMicOn);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopEndRadius: 20,
        flex: 1,
      }}
    >
      <Pressable
        onPress={switchCamera}
        style={{ backgroundColor: "grey", padding: 3, borderRadius: 50 }}
      >
        <Text>
          <Icon
            source={"camera-flip"}
            size={35}
            color={theme.colors.onPrimary}
          />
          {/* <Icon name={"flip-camera-ios"} size={35} color={"white"} /> */}
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleCamera}
        style={{ backgroundColor: "grey", padding: 3, borderRadius: 50 }}
      >
        <Text>
          <Icon
            source={isCameraOn ? "video" : "video-off"}
            size={35}
            color={theme.colors.onPrimary}
          />
          {/* <Icon
            name={isCameraOn ? "videocam" : "videocam-off"}
            size={35}
            color={"white"}
          /> */}
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleMicrophone}
        style={{ backgroundColor: "grey", padding: 3, borderRadius: 50 }}
      >
        <Text>
          <Icon
            source={isMicOn ? "microphone" : "microphone-off"}
            size={35}
            color={"white"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={endCall}
        style={{
          backgroundColor: theme.colors.error,
          padding: 3,
          borderRadius: 50,
        }}
      >
        <Text>
          <Icon source={"phone-hangup"} size={35} color={"white"} />
        </Text>
      </Pressable>
    </View>
  );
};

export default CallActionBox;
