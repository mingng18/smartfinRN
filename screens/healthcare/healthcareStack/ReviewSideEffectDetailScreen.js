import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { Alert, View } from "react-native";
import { useDispatch } from "react-redux";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import {
  FIREBASE_COLLECTION,
  SIDE_EFFECT_SEVERITY,
  SIDE_EFFECT_STATUS,
} from "../../../constants/constants";
import { editDocument } from "../../../util/firestoreWR";
import { deleteSideEffect } from "../../../store/redux/sideEffectSlice";
import SideEffectChip from "../../../components/ui/SideEffectChip";
import LoadingIndicatorDialog from "../../../components/ui/LoadingIndicatorDialog";
import { useTranslation } from "react-i18next";

export default function ReviewSideEffectDetailScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentSideEffect = params.sideEffect;
  const dispatch = useDispatch();
  const { t } = useTranslation("healthcare");

  const [remarks, setRemarks] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("side_effect"),
    });
  });

  const handleSideEffectReviewSubmission = async () => {
    setIsLoading(true);
    const storedUid = await SecureStore.getItemAsync("uid");
    try {
      const updatedSideEffect = {
        remarks: remarks,
        healthcare_id: storedUid,
        reviewed_timestamp: new Date(),
        se_status: SIDE_EFFECT_STATUS.REVIEWED,
      };

      await editDocument(
        FIREBASE_COLLECTION.SIDE_EFFECT,
        currentSideEffect.id,
        updatedSideEffect
      );

      // Update state or dispatch an action if necessary
      dispatch(deleteSideEffect({ id: currentSideEffect.id }));
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t("reviewed"));
      navigation.goBack();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoading(false);
      Alert.alert(t("submit_error_title"), t("submit_error_message"));
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <HorizontalCard
          cardType={"sideEffect"}
          profilePic={currentSideEffect.patient_profile_picture}
          subject={capitalizeFirstLetter(currentSideEffect.patient_first_name)}
          status={t(currentSideEffect.severity)}
          date={new Date(currentSideEffect.created_timestamp)
            .toISOString()
            .slice(0, 10)}
          time={new Date(
            currentSideEffect.created_timestamp
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          color={
            currentSideEffect.severity === SIDE_EFFECT_SEVERITY.GRADE_1
              ? theme.colors.surfaceContainer
              : theme.colors.errorContainer
          }
        />
        {/* ========================SIDE EFFECTS======================= */}
        <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 8 }}>
          {t("side_effects")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentSideEffect.symptoms.length > 0 ? (
            currentSideEffect.symptoms.map((symptom, i) => (
              <SideEffectChip symptom={symptom} key={i} />
            ))
          ) : (
            <></>
          )}
        </View>
        {/* ========================Remarks/Notes======================= */}
        <Text variant="titleLarge" style={{ marginTop: 24, marginBottom: 8 }}>
          {t("remarks_notes")}
        </Text>
        <TextInput
          mode="outlined"
          placeholder={t("enter_notes")}
          multiline
          style={{ height: 120 }}
          value={remarks}
          onChangeText={(text) => setRemarks(text)}
        />
        {/* ========================Buttons======================= */}
        <View
          style={{
            marginTop: 40,
            flexDirection: "row-reverse",
            marginBottom: 56,
          }}
        >
          <Button
            mode="contained"
            style={{ marginLeft: 16 }}
            onPress={() => handleSideEffectReviewSubmission()}
          >
            {t("review")}
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16 }}
            onPress={() => {}}
          >
            {t("call_patient")}
          </Button>
        </View>
      </ScrollView>
      <LoadingIndicatorDialog
        visible={isLoading}
        close={() => {
          setIsLoading(false);
        }}
        title={t("reviewing_side_effect")}
        bodyText={t("please_wait")}
      />
    </View>
  );
}
