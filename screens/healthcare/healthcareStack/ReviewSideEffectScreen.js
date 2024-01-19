import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import {
  sideEffectContainerColor,
  sideEffectGradeText,
} from "../../../util/sideEffectUtil";
import { SIDE_EFFECT_SEVERITY } from "../../../constants/constants";

const ReviewSideEffectScreen = () => {
  const theme = useTheme();
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const navigation = useNavigation();
  // const sortedSideEffects = React.useMemo(() => {
  //   console.log(sideEffects + " here")
  //   if (sideEffects.length > 0) {
  //     return [...sideEffects].sort((a, b) => {
  //       if (a.severity < b.severity) return 1;
  //       if (a.severity > b.severity) return -1;
  //       return 0;
  //     });
  //   }else{
  //     return [];
  //   }
  // }, [sideEffects]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Side Effects Alert",
    });
  });

  const sortedSideEffects = React.useMemo(() => {
    if (sideEffects.length > 0) {
      return [...sideEffects].sort((a, b) => {
        if (a.severity < b.severity) return 1;
        if (a.severity > b.severity) return -1;
        return 0;
      });
    } else {
      return [];
    }
  }, [sideEffects]);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {sideEffects.length > 0 ? (
          sortedSideEffects.map((sideEffect, i) => {
            return (
              <HorizontalCard
                key={`sideEffect-${i}`}
                cardType={"sideEffect"}
                profilePic={sideEffect.patient_profile_picture}
                subject={capitalizeFirstLetter(sideEffect.patient_first_name)}
                status={
                  sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
                    ? "Grade 1"
                    : sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_2
                    ? "Grade 2"
                    : "Grade 3"
                }
                date={new Date(sideEffect.created_timestamp)
                  .toISOString()
                  .slice(0, 10)}
                time={new Date(sideEffect.created_timestamp).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
                color={sideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
                ? theme.colors.surfaceContainer
                : 
                theme.colors.errorContainer}
                onPressedCallback={() => {
                  navigation.navigate("ReviewSideEffectDetailScreen", {
                    sideEffect: sideEffect,
                  });
                }}
              />
            );
          })
        ) : (
          <Text variant="bodyLarge">
            All the side effects had been reviewed!
          </Text>
        )}
        <View style={{ marginBottom: 56 }} />
      </ScrollView>
    </View>
  );
};

export default ReviewSideEffectScreen;
