import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Chip, useTheme } from "react-native-paper";
import { Timestamp } from "firebase/firestore";

export default function CustomCalendar({
  video,
  sideEffect,
  appointment,
  highlightedDates,
  selectedDate,
  setSelectedDate,
  isVideo,
  setIsVideo,
  isAppointment,
  setIsAppointment,
  isSideEffect,
  setIsSideEffect,
}) {
  const theme = useTheme();

  //useMemo to optimise performance
  //Decide which colour to color the container
  const marked = React.useMemo(() => {
    return highlightedDates.reduce((acc, date) => {
      const videoMatch = video.some(
        (item) =>
          new Date(item.uploaded_timestamp).toISOString().slice(0, 10) === date
      );
      const appointmentMatch = appointment.some(
        (item) =>
          new Date(item.scheduled_timestamp).toISOString().slice(0, 10) === date
      );
      const sideEffectMatch = sideEffect.some(
        (item) =>
          new Date(item.side_effect_occuring_timestamp)
            .toISOString()
            .slice(0, 10) === date
      );

      if (
        (isVideo && videoMatch) ||
        (isAppointment && appointmentMatch) ||
        (isSideEffect && sideEffectMatch)
      ) {
        acc[date] = {
          selected: true,
          selectedColor:
            isVideo && videoMatch
              ? theme.colors.primaryFixedDim
              : isAppointment && appointmentMatch
              ? theme.colors.secondaryContainer
              : isSideEffect && sideEffectMatch
              ? theme.colors.yellowContainer
              : theme.colors.background,
          selectedTextColor: theme.colors.onBackground,
        };
      }
      return acc;
    }, {});
  }, [
    highlightedDates,
    video,
    appointment,
    sideEffect,
    isVideo,
    isAppointment,
    isSideEffect,
  ]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 24,
          overflow: "hidden"
        }}
      >
        <Chip
          mode={!isAppointment && "outlined"}
          style={[styles.chip, styles.firstChip]}
          onPress={() => setIsAppointment(!isAppointment)}
          theme={{
            colors: { secondaryContainer: theme.colors.secondaryContainer },
          }}
        >
          Appointment
        </Chip>
        <Chip
          mode={!isVideo && "outlined"}
          onPress={() => setIsVideo(!isVideo)}
          style={[styles.chip, styles.secondChip]}
          theme={{
            colors: { secondaryContainer: theme.colors.primaryFixedDim },
          }}
        >
          Video
        </Chip>
        <Chip
          mode={!isSideEffect && "outlined"}
          onPress={() => setIsSideEffect(!isSideEffect)}
          style={[styles.chip, styles.thirdChip]}
          theme={{
            colors: { secondaryContainer: theme.colors.yellowContainer },
          }}
        >
          Side Effect
        </Chip>
      </View>
      <Calendar
        theme={{
          calendarBackground: theme.colors.background,
          monthTextColor: theme.colors.onBackground,
          textDayFontFamily: "DMSans-Regular",
          textMonthFontFamily: "DMSans-Regular",
          textDayHeaderFontFamily: "DMSans-Regular",
          arrowColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...marked,
          [selectedDate]: {
            selected: true,
            selectedColor: theme.colors.surfaceContainerHigh,
            selectedTextColor: theme.colors.onBackground,
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    borderWidth: 1,
    // overflow: "hidden",
  },
  firstChip: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  secondChip: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  thirdChip: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
});
