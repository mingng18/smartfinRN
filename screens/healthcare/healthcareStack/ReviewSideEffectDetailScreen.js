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
  SIDE_EFFECT_STATUS,
  USER_TYPE,
} from "../../../constants/constants";
import { editDocument } from "../../../util/firestoreWR";
import { deleteSideEffect } from "../../../store/redux/sideEffectSlice";
import SideEffectChip from "../../../components/ui/SideEffectChip";
import {
  sideEffectContainerColor,
  sideEffectGradeText,
} from "../../../util/sideEffectUtil";

export default function ReviewSideEffectDetailScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const currentSideEffect = params.sideEffect;
  const [remarks, setRemarks] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Side Effect",
    });
  });

  const handleSideEffectReviewSubmission = async() => {
    // try {
      const storedUid = await SecureStore.getItemAsync("uid");
      await editDocument(
        FIREBASE_COLLECTION.SIDE_EFFECT,
        currentSideEffect.id,
        {
          remarks: remarks,
          healthcare_id: storedUid,
          reviewed_timestamp: new Date(),
          se_status: SIDE_EFFECT_STATUS.REVIEWED,
        }
      );
      // Update state or dispatch an action if necessary
      Alert.alert("Reviewed");
      //TODO fix this shit, this line gt prob but idk whr
      // dispatch(deleteSideEffect(currentSideEffect.id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    // } catch (error) {
    //   console.log(error, " occurred when editing side Effect");
    //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    //   Alert.alert(
    //     "Submit Error",
    //     "Something went wrong. Please try again later."
    //   );
    // }
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
          status={sideEffectGradeText(currentSideEffect)}
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
          color={sideEffectContainerColor(currentSideEffect)}
        />
        {/* ========================SIDE EFFECTS======================= */}
        <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 8 }}>
          Side Effects
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
          Remarks/Notes
        </Text>
        <TextInput
          mode="outlined"
          placeholder="Enter notes"
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
            Review
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginLeft: 16 }}
            onPress={() => {}}
          >
            Call Patient
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
