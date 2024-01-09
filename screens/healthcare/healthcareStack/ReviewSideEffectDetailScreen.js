import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Chip,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { ResizeMode, Video } from "expo-av";
import { Alert, StyleSheet, View } from "react-native";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";

import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { FIREBASE_COLLECTION, TREATMENT, VIDEO_STATUS } from "../../../constants/constants";
import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { editDocument } from "../../../util/firestoreWR";
import { deleteSideEffect, updateSideEffect } from "../../../store/redux/sideEffectSlice";
import InformationChip from "../../../components/ui/InformationChip";

export default function ReviewSideEffectDetailScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const currentSideEffect = params.sideEffect;
  const index = params.index;
  const dispatch = useDispatch();

  //Dialog
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState(false);

  const [remarks, setRemarks] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Side Effect",
    });
  });

  async function handleSideEffectReviewSubmission() {
    const storedUid = await SecureStore.getItemAsync("uid");
    try {
      await editDocument(FIREBASE_COLLECTION.SIDE_EFFECT, currentSideEffect.id, {
        remarks: remarks,
        healthcare_id: storedUid,
        reviewed_timestamp: serverTimestamp(),
        se_status: "reviewed",
      }).then(() => {
        console.log("Side Effect Review Submission Success");
        navigation.goBack();
      });
    dispatch(updateSideEffect({ id: currentSideEffect.id, changes: currentSideEffect }));
    dispatch(deleteSideEffect(currentSideEffect.id));
    } catch (error) {
        console.log(error + " occured when editing side Effect")
      Alert.alert(
        "Submit Error",
        "Something went wrong. Please try again later."
      );
    }
  }

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
          key={`review-${index}`}
          cardType={"sideEffect"}
          profilePic={currentSideEffect.patient_profile_picture}
          subject={capitalizeFirstLetter(currentSideEffect.patient_first_name)}
          status={capitalizeFirstLetter(currentSideEffect.severity)}
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
          color={currentSideEffect.cardColor}
          onPressedCallback={() => {}}
        />
        {/* ========================SIDE EFFECTS======================= */}
        <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 8 }}>
          Side Effects
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentSideEffect.symptoms.length > 0
            ? currentSideEffect.symptoms.map((symptom, i) => {
                return (
                    <InformationChip
                        text = {symptom.label}
                    ></InformationChip>
                //   <Chip
                //     style={{
                //       marginVertical: 8,
                //       marginRight: 8,
                //       paddingVertical: 6,
                //     }}
                //   >
                //     {symptom.label}
                //   </Chip>
                );
              })
            : null}
        </View>
        {/* ========================Remarks/Notes======================= */}
        <Text variant="titleLarge" style={{ marginTop: 24 }}>
          Remarks/Notes
        </Text>
        <TextInput
          mode="outlined"
          label="Write your remarks/notes here"
          placeholder="Type your remarks/notes here"
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
            Submit
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
