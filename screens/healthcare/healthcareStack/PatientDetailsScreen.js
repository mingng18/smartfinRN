import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, RadioButton, Text, useTheme } from "react-native-paper";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import { DIAGNOSIS, NOTES, TREATMENT } from "../../../constants/constants";
import InformationChip from "../../../components/ui/InformationChip";
import PatientDetailsTab from "../../../navigation/PatientDetailsTab";
import { debounce } from "lodash";
import { editDocument } from "../../../util/firestoreWR";
import { useDispatch } from "react-redux";
import { updatePatientData } from "../../../store/redux/patientDataSlice";
import CustomDropDownPicker from "../../../components/ui/CustomDropDownPicker";
import { useTranslation } from "react-i18next";

export default function PatientDetailsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const [currentPatient, setCurrentPatient] = React.useState(params.patient);
  const dispatch = useDispatch();
  const { t } = useTranslation("healthcare");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("patient_profile"),
    });
  });

  // React.useEffect(() => {
  //   if (currentPatient.notes !== "") {
  //     setNotes(currentPatient.notes);
  //   }
  // }, [currentPatient]);

  const [notesOpen, setNotesOpen] = React.useState(false);
  const [notes, setNotes] = React.useState("government_hospital");
  const [notesData, setNotesData] = React.useState(NOTES);

  const updateNotes = async (note) => {
    console.log("clicked");
    const updatedData = {
      notes: note,
    };
    try {
      await editDocument("patient", currentPatient.id, updatedData);
      dispatch(
        updatePatientData({ id: currentPatient.id, changes: updatedData })
      );
      setCurrentPatient({ ...currentPatient, notes: note });
      console.log("success");
    } catch (error) {
      console.log("error " + error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1 }}
        // contentContainerStyle={{flex: 1}}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <View style={[styles.homeHeader]}>
            <Image
              source={
                currentPatient.profile_pic_url
                  ? { uri: currentPatient.profile_pic_url }
                  : BLANK_PROFILE_PIC
              }
              style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                variant="headlineLarge"
                style={[styles.headerText]}
              >
                {`${capitalizeFirstLetter(
                  currentPatient.first_name
                )} ${capitalizeFirstLetter(currentPatient.last_name)}`}
              </Text>
              <Text variant="bodyLarge" style={[styles.headerText]}>
                {currentPatient.notes
                  ? capitalizeFirstLetter(currentPatient.notes)
                  : t("no_notes")}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap" }}
          >
            <InformationChip
              text={currentPatient.nric_passport}
              icon={"card-account-details"}
              style={{ width: "60%" }}
              isBlur
            />
            <InformationChip
              text={t(currentPatient.gender)}
              icon={"gender-male-female"}
              style={{ width: "40%" }}
            />
            <InformationChip
              text={currentPatient.phone_number}
              icon={"phone"}
              style={{ width: "60%" }}
              isBlur
            />
            <InformationChip
              text={currentPatient.age}
              icon={"face-man"}
              style={{ width: "40%" }}
            />
            <InformationChip
              text={currentPatient.nationality}
              icon={"flag"}
              style={{ width: "60%" }}
            />
          </View>
          <Text variant="titleLarge" style={{ marginTop: 32 }}>
            {t("diagnosis")}
          </Text>
          <Text variant="bodyLarge" style={{ marginTop: 8 }}>
            {
              DIAGNOSIS.find(
                (diagnosis) => diagnosis.value === currentPatient.diagnosis
              ).label
            }
          </Text>
          <Text
            variant="labelLargeProminent"
            style={{ alignSelf: "flex-end", marginTop: 8 }}
          >
            {t("on_date", {
              date: currentPatient.date_of_diagnosis.slice(0, 10),
            })}
          </Text>
          <View
            style={{
              marginTop: 32,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="titleLarge">{t("treatment_information")}</Text>
            {/* <IconButton icon="pencil" size={24} onPress={() => {}} /> */}
          </View>
          <Text variant="bodyLarge" style={{ marginTop: 8 }}>
            {
              TREATMENT.find(
                (treatment) => treatment.value === currentPatient.treatment
              ).label
            }
          </Text>
          <Text
            variant="labelLargeProminent"
            style={{ alignSelf: "flex-end", marginTop: 8 }}
          >
            {t("tablets", {
              number: currentPatient.number_of_tablets,
              month: currentPatient.treatment_duration_months,
            })}
          </Text>
          <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 8 }}>
            {t("notes")}
          </Text>
          {/* <View style={{ flexDirection: "row" }}>
            <Pressable
              style={{
                flexDirection: "row",
                marginRight: 24,
                alignItems: "center",
              }}
              onPress={() => handleNotesChange(NOTES.VOTS)}
            >
              <RadioButton.Android
                value={NOTES.VOTS}
                status={
                  currentPatient.notes === NOTES.VOTS ? "checked" : "unchecked"
                }
                onPress={() => handleNotesChange(NOTES.VOTS)}
              />
              <Text variant="labelLarge">{NOTES.VOTS}</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                marginRight: 16,
                alignItems: "center",
              }}
              onPress={() => handleNotesChange(NOTES.DOTS)}
            >
              <RadioButton.Android
                value={NOTES.DOTS}
                status={
                  currentPatient.notes === NOTES.DOTS ? "checked" : "unchecked"
                }
                onPress={() => handleNotesChange(NOTES.DOTS)}
              />
              <Text variant="labelLarge">{NOTES.DOTS}</Text>
            </Pressable>
          </View> */}
          <CustomDropDownPicker
            listMode="SCROLLVIEW"
            zIndex={3000}
            zIndexInverse={1000}
            open={notesOpen}
            setOpen={setNotesOpen}
            value={notes}
            setValue={setNotes}
            items={notesData}
            setItems={setNotesData}
            onChangeValue={(value) => updateNotes(value)}
            placeholder={t("notes_placeholder")}
          />
          <View style={{ marginBottom: 32 }} />
        </View>
        <View style={{ minHeight: 500 }}>
          <PatientDetailsTab patient={currentPatient} />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 16,
    flexWrap: "wrap",
  },
});
