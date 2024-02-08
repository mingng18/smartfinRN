import React, { forwardRef, useImperativeHandle } from "react";
import { FIREBASE_COLLECTION } from "../../constants/constants";
import {
  VictoryAxis,
  VictoryBar,
  VictoryLabel,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
} from "victory-native";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import Legend from "./Legend";
import { fetchSideEffectsForPatient } from "../../util/firestoreWR";
import { useSelector } from "react-redux";

const SideEffectDetailsGraph = forwardRef((props, ref) => {
  const [sideEffectSymptoms, setSideEffectSymptoms] = React.useState([]);
  const { t } = useTranslation("healthcare");
  const [sideEffectData, setSideEffectData] = React.useState([]);
  const patients = useSelector((state) => state.patientDataObject.patients);
  const theme = useTheme();
  const colorContainer = [
    theme.colors.primary,
    theme.colors.primaryContainer,
    theme.colors.yellow,
    theme.colors.yellowContainer,
    theme.colors.secondary,
    theme.colors.secondaryContainer,
    theme.colors.green,
    theme.colors.greenContainer,
    theme.colors.tertiary,
    theme.colors.tertiaryContainer,
    theme.colors.error,
    theme.colors.errorContainer,
    theme.colors.surface,
    theme.colors.surfaceContainer,
    theme.colors.onPrimary,
    theme.colors.onPrimary,
  ];

  useImperativeHandle(ref, () => ({
    fetchData() {
      fetchSideEffectSymptomsNumbersThisMonth();
      // console.log("Patient id is " + patients[0].id)
    },
  }));

  async function fetchSideEffectSymptomsNumbersThisMonth() {
    try {
      // const sideEffectData = await fetchSideEffectsForPatient(patients[0].id);
      const data = await fetchSideEffectsForPatient(
        "qdaTf62DoAVd27Q3phtY5cIlv4F3"
      );
      setSideEffectData(data);
      const sideEffectCounts = new Map();

      sideEffectData.forEach((sideEffect) => {
        sideEffect.symptoms.forEach((symptom) => {
          const count = sideEffectCounts.get(symptom.label) || 0;
          sideEffectCounts.set(symptom.label, count + 1);
        });
      });

      // Convert the map to the desired format
      const formattedData = Array.from(sideEffectCounts).map(
        ([symptom, count]) => {
          // console.log("symptom is " + symptom);
          // console.log("symptom is " + t(symptom));
          return {
            x: t(symptom),
            y: count,
          };
        }
      );

      // Update the state with the formatted data
      setSideEffectSymptoms(formattedData);
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
        {t("number_of_symptoms_this_month", {
          name: "BRUH",
        })}
      </Text>
      <VictoryPie
        // width={}
        radius={({ datum }) => 50 + datum.y * 20}
        data={sideEffectSymptoms}
      />
    </>
  );
});

export default SideEffectDetailsGraph;
