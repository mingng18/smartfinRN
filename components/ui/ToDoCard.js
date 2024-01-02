import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from "react-native-paper";

export default function ToDoCard({ icon, title, count, onPressedCallback }) {
  const theme = useTheme();

  return (
    <View style={[{ borderRadius: 8, overflow: "hidden", marginLeft: 16 }]}>
      <Pressable
        onPress={onPressedCallback}
        android_ripple={{ color: theme.colors.onBackground, borderless: true }}
        style={{
          backgroundColor: theme.colors.primary,
        }}
      >
        <View style={[styles.todoCard]}>
          <Icon source={icon} size={40} color={theme.colors.onPrimary} />
          <View style={{ flexDirection: "column", marginLeft: 8 }}>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onPrimary }}
            >
              {title}
            </Text>
            {count != 0 && (
              <Text
                variant="labelLargeProminent"
                style={{ color: theme.colors.yellow }}
              >
                {count}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    flexDirection: "row",
    padding: 8,
    // paddingBottom: 0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
