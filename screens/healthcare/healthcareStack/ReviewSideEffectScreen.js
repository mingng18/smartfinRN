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

const ReviewSideEffectScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const sideEffects = useSelector(
    (state) => state.sideEffectObject.sideEffects
  );
  const sortedSideEffects = React.useMemo(() => {
    if (sideEffects.length > 0) {
      return [...sideEffects].sort((a, b) => {
        if (a.severity < b.severity) return 1;
        if (a.severity > b.severity) return -1;
        return 0;
      });
    }
    return [];
  }, [sideEffects]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Side Effects Alert",
    });
  });

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {sortedSideEffects.length > 0 ? (
          sortedSideEffects.map((sideEffect, i) => {
            return (
              <HorizontalCard
                key={`review-${i}`}
                cardType={"sideEffect"}
                profilePic={sideEffect.patient_profile_picture}
                subject={capitalizeFirstLetter(sideEffect.patient_first_name)}
                status={sideEffectGradeText(sideEffect)}
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
                color={sideEffectContainerColor(sideEffect)}
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
