import { Pressable } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function TextListButton({onPressCallback, text}) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
      }}
      onPress={onPressCallback()}
    >
      <Text variant="titleLarge">{text}</Text>
      <IconButton icon="arrow-top-right" size={24} onPress={() => {}} />
    </Pressable>
  );
}
