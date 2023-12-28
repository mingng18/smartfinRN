import { Image, Pressable, StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Chip, IconButton, Text, useTheme } from "react-native-paper";
import TextListButton from "../../components/ui/TextListButton";

function PatientProfileScreen() {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      {/* ===================HEADER==================== */}
      <View style={[styles.homeHeader]}>
        {/* TODO Change the name to the patients image */}
        <Image
          source={require("../../assets/blank-profile-pic.png")}
          style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
        />
        <View style={[styles.headerText]}>
          {/* TODO Change the name to the patients name */}
          <Text variant="headlineLarge">Arul</Text>
          <View style={{ flexDirection: "row" }}>
            <Text variant="bodyLarge">You are doing </Text>
            <Text
              variant="bodyLarge"
              style={{ fontFamily: "DMSans-Bold", color: theme.colors.green }}
            >
              GOOD
            </Text>
            <Text variant="bodyLarge"> !</Text>
          </View>
        </View>
        <IconButton icon="pencil" size={24} onPress={() => {}} />
      </View>
      {/* ========================PERSONAL INFO======================= */}
      {/* TODO change the personal information */}
      <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap" }}>
        <Chip
          selected
          icon="gender-male-female"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Male
        </Chip>
        <Chip
          selected
          icon="card-account-details"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          173629073234
        </Chip>
        <Chip
          selected
          icon="face-man"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          21
        </Chip>
        <Chip selected icon="flag" style={{ marginRight: 8, marginBottom: 8 }}>
          Malaysia
        </Chip>
        <Chip selected icon="phone" style={{ marginRight: 8, marginBottom: 8 }}>
          +6011 74232381
        </Chip>
      </View>
      {/* ======================= Progress Tracker =================== */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
          // backgroundColor: theme.colors.surfaceContainerLow,
          height: "22%",
        }}
      >
        <IconButton
          style={{ position: "absolute", right: "0%", top: "0%" }}
          icon="arrow-top-right"
          size={24}
          onPress={() => {}}
        />
        <AnimatedCircularProgress
          size={280}
          width={15}
          fill={50}
          tintColor={theme.colors.primary}
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor={theme.colors.primaryContainer}
          arcSweepAngle={180}
          rotation={270}
        >
          {(fill) => (
            <>
              <Text variant="headlineLarge">{fill}%</Text>
              <Text variant="titleMedium">Progress Completion</Text>
              <Text variant="labelLarge">1st Month</Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
              <Text variant="labelLarge" style={{ opacity: 0 }}>
                1st Month
              </Text>
            </>
          )}
        </AnimatedCircularProgress>
      </View>
      {/* ========================== Settings ======================= */}
      <TextListButton text={"Settings"} onPressCallback={() => {}} />
      <TextListButton text={"History"} onPressCallback={() => {}} />
      <Button mode="contained" style={{ marginTop: 24 }} onPress={() => {}}>
        Sign Out
      </Button>
    </View>
  );
}

export default PatientProfileScreen;

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
  },
  headerText: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
  toDoList: {
    paddingTop: 16,
    borderRadius: 16,
  },
  tbMaterial: {
    paddingTop: 16,
  },
});
