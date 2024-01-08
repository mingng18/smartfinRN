import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function Legend({ color, text }) {
  return (
    <View
      style={{ marginLeft: 16, marginBottom: 16, flexDirection: "row-reverse" }}
    >
      <Text variant="labelMedium" style={{ marginLeft: 4 }}>
        {text}
      </Text>
      <Icon source="circle" color={color} size={16} />
    </View>
  );
}
