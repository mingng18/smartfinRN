import { Chip, Text, useTheme } from "react-native-paper";
import { capitalizeFirstLetter } from "../../util/wordUtil";
import { useTranslation } from "react-i18next";

export default function SideEffectChip({ symptom }) {
  const theme = useTheme();
  const { t } = useTranslation("patient");

  function formatSymptomKey(symptom) {
    // Replace spaces with underscores and convert to lowercase
    return symptom.toLowerCase().replace(/\s+/g, "_").replace(/\(|\)/g, "");
  }

  return (
    <Chip
      style={{
        marginRight: 8,
        marginBottom: 8,
        backgroundColor:
          symptom.grade == 3
            ? theme.colors.errorContainer
            : symptom.grade == 2
            ? theme.colors.errorContainer
            : theme.colors.surfaceContainer,
      }}
      textStyle={{
        flexWrap: "wrap",
      }}
    >
      {/* <Text numberOfLines={2} style={{ flexWrap: "wrap" }}> */}
      {symptom.grade == 0
        ? capitalizeFirstLetter(symptom.label)
        : `${t(formatSymptomKey(symptom.label))} : ${symptom.grade}`}
      {/* </Text> */}
      {/* {console.log(formatSymptomKey(symptom.label))} */}
    </Chip>
  );
}
