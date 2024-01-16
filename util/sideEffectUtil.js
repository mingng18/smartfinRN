import { useTheme } from "react-native-paper";
import { SIDE_EFFECT_SEVERITY } from "../constants/constants";

export function sideEffectContainerColor(sideEffect) {
  const theme = useTheme();
  return sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
    ? theme.colors.surfaceContainer
    : theme.colors.errorContainer;
}

export function sideEffectGradeText(sideEffect) {
  return sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
    ? "Grade 1"
    : sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_2
    ? "Grade 2"
    : "Grade 3";
}
