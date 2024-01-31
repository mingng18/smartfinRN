import React, { forwardRef, useImperativeHandle } from "react";
import { FIREBASE_COLLECTION } from "../../constants/constants";
import {
  VictoryAxis,
  VictoryBar,
  VictoryLabel,
  VictoryStack,
  VictoryTheme,
} from "victory-native";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import Legend from "./Legend";
import { fetchCollection } from "../../util/firestoreWR";

const SideEffectSubmittedGraph = forwardRef((props, ref) => {
  const [sideEffectAnalytic, setSideEffectAnalytic] = React.useState([]);
  const { t } = useTranslation("healthcare");
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    fetchData() {
      fetchSideEffectSubmittedThisMonth();
    },
  }));

  async function fetchSideEffectSubmittedThisMonth() {
    try {
      const sideEffectData = await fetchCollection(
        FIREBASE_COLLECTION.SIDE_EFFECT
      );
      const sideEffectCounts = new Map();
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the number of days in the current month

      // Initialize sideEffectCounts with 0 for all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        sideEffectCounts.set(day, { grade1: 0, grade2: 0, grade3: 0 });
      }

      sideEffectData.forEach((sideEffect) => {
        const sideEffectDate =
          sideEffect.side_effect_occuring_timestamp.toDate();

        if (
          sideEffectDate.getMonth() === currentMonth &&
          sideEffectDate.getFullYear() === currentYear
        ) {
          const day = sideEffectDate.getDate();
          const severity = sideEffect.severity;

          // Increment the count for the corresponding severity and day
          sideEffectCounts.get(day)[severity]++;
        }
      });

      // Convert the map to the desired format
      const formattedData = Array.from(sideEffectCounts).map(
        ([x, { grade1, grade2, grade3 }]) => ({
          x,
          grade1,
          grade2,
          grade3,
        })
      );

      // Update the state with the formatted data
      setSideEffectAnalytic(formattedData);
      // console.log(JSON.stringify(formattedData));
    } catch (error) {
      throw new Error("Failed to fetch collection size: " + error.message);
    }
  }

  return (
    <>
      <Text
        variant="labelLarge"
        style={{
          paddingTop: 32,
          marginHorizontal: 16,
        }}
      >
        {t("side_effects_submitted_this_month", {
          month: t(new Date().getMonth()),
        })}
      </Text>
      {sideEffectAnalytic.length > 0 && (
        <VictoryStack
          theme={VictoryTheme.material}
          colorScale={[
            theme.colors.primary,
            theme.colors.yellow,
            theme.colors.error,
          ]}
        >
          <VictoryBar data={sideEffectAnalytic} y="grade1" />
          <VictoryBar data={sideEffectAnalytic} y="grade2" />
          <VictoryBar data={sideEffectAnalytic} y="grade3" />
          <VictoryAxis
            label={t("date")}
            axisLabelComponent={<VictoryLabel dy={20} />}
          />
          <VictoryAxis
            dependentAxis
            label={t("number_of_side_effects")}
            axisLabelComponent={<VictoryLabel dy={-16} />}
            tickFormat={(tick) => {
              return Number.isInteger(tick) ? tick.toString() : "";
            }}
          />
        </VictoryStack>
      )}
      <View style={{ flexDirection: "row-reverse", marginTop: 16 }}>
        <Legend text={t("grade_3")} color={theme.colors.error} />
        <Legend text={t("grade_2")} color={theme.colors.yellow} />
        <Legend text={t("grade_1")} color={theme.colors.primary} />
      </View>
    </>
  );
});

export default SideEffectSubmittedGraph;
