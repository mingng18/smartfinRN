import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from "react-native-paper";

export default function HealthcareToDoCard({
  icon,
  title,
  count,
  onPressedCallback,
  style,
}) {
  const theme = useTheme();

  return (
    <View style={[{ borderRadius: 8, overflow: "hidden", flex: 1, ...style }]}>
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
            {
              <Text
                variant="labelLargeProminent"
                style={{ color: theme.colors.yellow }}
              >
                {count}
              </Text>
            }
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

    // paddingRight: 8,
    // paddingBottom: 0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "right",
  },
});
