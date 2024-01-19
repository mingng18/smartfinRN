import { Pressable } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function TextListButton({onPressCallback, text, textVariant, marginTopValue}) {
  if (marginTopValue !== undefined && marginTopValue !== null && marginTopValue !== "") {
    marginTop = marginTopValue;
  } else {
    marginTop = 16;
  }
  
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: marginTop,
      }}
      onPress={onPressCallback}
    >
      {textVariant? <Text variant= {textVariant}>{text}</Text> : <Text variant="titleLarge">{text}</Text>} 
      <IconButton icon="arrow-top-right" size={24} onPress={onPressCallback} />
    </Pressable>
  );
}
