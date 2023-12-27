import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function HorizontalCard({
  profilePic,
  subject,
  status,
  date,
  time,
  color,
  onPressedCallback,
}) {
  const theme = useTheme();

  return (
    <View style={[styles.pressableContainer, { backgroundColor: color }]}>
      <Pressable
        onPress={onPressedCallback}
        android_ripple={{ color: theme.colors.onBackground, borderless: false }}
        style={[styles.cardContainer]}
      >
        <Image source={{ uri: profilePic }} style={styles.profilePicStyle} />
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={styles.textContainer}>
            <Text variant="titleMedium">{subject}</Text>
            <Text variant="labelMedium">{status}</Text>
          </View>
          <View style={[styles.textContainer, { paddingTop: 0 }]}>
            <Text variant="bodyMedium">{date}</Text>
            <Text variant="bodyMedium">{time}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 16,
  },
  cardContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicStyle: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 40 / 2,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
