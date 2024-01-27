import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Chip, useTheme } from "react-native-paper";
import { CALENDAR_ENTITIES } from "../../constants/constants";
import Legend from "./Legend";
import { useSelector } from "react-redux";

export default function CustomCalendar({
  video,
  sideEffect,
  appointment,
  highlightedDates,
  selectedDate,
  setSelectedDate,
  currentSelected,
  setCurrentSelected,
}) {
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);
  const today = new Date();
  // console.log(today);
  // console.log(today.slice(0, 10));

  //useMemo to optimise performance
  //Decide which colour to color the container
  const marked = React.useMemo(() => {
    return highlightedDates.reduce((acc, date) => {
      //Side effect is selected
      if (currentSelected === CALENDAR_ENTITIES.SIDE_EFFECT) {
        const sideEffectMatch = sideEffect.some(
          (item) =>
            new Date(item.side_effect_occuring_timestamp)
              .toISOString()
              .slice(0, 10) === date
        );
        acc[date] = {
          selected: true,
          selectedColor: sideEffectMatch
            ? theme.colors.yellowContainer
            : theme.colors.background,
          selectedTextColor: theme.colors.onBackground,
        };
      }

      //Appointment is selected
      if (currentSelected === CALENDAR_ENTITIES.APPOINTMENT) {
        const appointmentMatch = appointment.some(
          (item) =>
            new Date(item.scheduled_timestamp).toISOString().slice(0, 10) ===
            date
        );
        acc[date] = {
          selected: true,
          selectedColor: appointmentMatch
            ? theme.colors.secondaryContainer
            : theme.colors.background,
          selectedTextColor: theme.colors.onBackground,
        };
      }

      //Video is selected
      if (currentSelected === CALENDAR_ENTITIES.VIDEO) {
        const startDate = new Date(user.date_of_diagnosis);
        const treatmentEndDate = new Date(startDate);
        treatmentEndDate.setMonth(
          treatmentEndDate.getMonth() + user.treatment_duration_months
        );
        while (startDate <= treatmentEndDate) {
          const dateString = startDate.toISOString().slice(0, 10);
          const videoMatch = video.find(
            (item) => item.uploaded_timestamp.slice(0, 10) === dateString
          );

          if (videoMatch) {
            acc[dateString] = {
              selected: true,
              selectedColor: theme.colors.greenContainer,
              selectedTextColor: theme.colors.onBackground,
            };
          } else if (!videoMatch && startDate <= today) {
            acc[dateString] = {
              selected: true,
              selectedColor: theme.colors.errorContainer,
              selectedTextColor: theme.colors.onBackground,
            };
          } else {
            acc[dateString] = {
              selected: true,
              selectedColor: theme.colors.surfaceContainerHigh,
              selectedTextColor: theme.colors.onBackground,
            };
          }
          startDate.setDate(startDate.getDate() + 1); // Move to the next date
        }
      }
      return acc;
    }, {});
  }, [highlightedDates, video, appointment, sideEffect, currentSelected]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <Chip
          mode={currentSelected !== CALENDAR_ENTITIES.APPOINTMENT && "outlined"}
          style={[styles.chip, styles.firstChip]}
          onPress={() => setCurrentSelected(CALENDAR_ENTITIES.APPOINTMENT)}
          theme={{
            colors: { secondaryContainer: theme.colors.secondaryContainer },
          }}
        >
          Appointment
        </Chip>
        <Chip
          mode={currentSelected !== CALENDAR_ENTITIES.VIDEO && "outlined"}
          onPress={() => setCurrentSelected(CALENDAR_ENTITIES.VIDEO)}
          style={[styles.chip, styles.secondChip]}
          theme={{
            colors: { secondaryContainer: theme.colors.primaryFixedDim },
          }}
        >
          Video
        </Chip>
        <Chip
          mode={currentSelected !== CALENDAR_ENTITIES.SIDE_EFFECT && "outlined"}
          onPress={() => setCurrentSelected(CALENDAR_ENTITIES.SIDE_EFFECT)}
          style={[styles.chip, styles.thirdChip]}
          theme={{
            colors: { secondaryContainer: theme.colors.yellowContainer },
          }}
        >
          Side Effect
        </Chip>
      </View>
      <Calendar
      // initialDate=""
      // context={{ date : '' }}
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
            selected:
              currentSelected === CALENDAR_ENTITIES.VIDEO ? false : true,
            selectedColor: theme.colors.onBackground,
            // selectedTextColor: theme.colors.onBackground,
          },
          // ['2024-01-27']: {
          //   selected: true,
          //   selectedColor: theme.colors.onBackground,
          //   selectedTextColor: theme.colors.onBackground,
          // },
        }}
      />
      {currentSelected === CALENDAR_ENTITIES.VIDEO && (
        <View
          style={{
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <Legend
            color={theme.colors.greenContainer}
            text={"Video Submitted"}
          />
          <Legend color={theme.colors.errorContainer} text={"Video Missed"} />
        </View>
      )}
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
