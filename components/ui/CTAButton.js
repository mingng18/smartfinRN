import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function CTAButton({
  icon,
  title,
  color,
  onPressedCallback,
  isLastItem,
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          borderRadius: 8,
          overflow: "hidden",
          marginLeft: 16,
          flex: 1,
        },
        isLastItem ? { marginRight: 16 } : {},
      ]}
    >
      <Pressable
        onPress={onPressedCallback}
        android_ripple={{ color: theme.colors.onBackground, borderless: true }}
        style={{
          backgroundColor: color,
        }}
      >
        <View style={[styles.todoCard]}>
          <Icon source={icon} size={40} color={theme.colors.onPrimary} />
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.onPrimary, textAlign: "center", marginTop: 4 }}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 96,
    marginVertical: 4,
    marginHorizontal: 1,
  },
});
