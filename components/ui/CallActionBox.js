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
        justifyContent: "space-around",
        paddingHorizontal: 24,
        paddingVertical: 24,
        flex: 1,
      }}
    >
      <Pressable
        onPress={switchCamera}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text>
          <Icon
            source={"camera-flip"}
            size={32}
            color={theme.colors.onPrimary}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleCamera}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text>
          <Icon
            source={isCameraOn ? "video" : "video-off"}
            size={32}
            color={theme.colors.onPrimary}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleMicrophone}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text>
          <Icon
            source={isMicOn ? "microphone" : "microphone-off"}
            size={32}
            color={"white"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={endCall}
        style={{
          backgroundColor: theme.colors.error,
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text>
          <Icon source={"phone-hangup"} size={32} color={"white"} />
        </Text>
      </Pressable>
    </View>
  );
};

export default CallActionBox;
