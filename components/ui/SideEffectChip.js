import { Chip, useTheme } from "react-native-paper";
import { capitalizeFirstLetter } from "../../util/wordUtil";

export default function SideEffectChip({ symptom }) {
  const theme = useTheme();

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
    >
      {symptom.grade == 0
        ? capitalizeFirstLetter(symptom.label)
        : `${capitalizeFirstLetter(symptom.label)} : ${symptom.grade}`}
    </Chip>
  );
}
