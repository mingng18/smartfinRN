import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import HorizontalCard from "../../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../../util/wordUtil";
import {
  COMPLIANCE_STATUS,
  HORIZONTAL_CARD_TYPE,
} from "../../../constants/constants";
import { useTranslation } from "react-i18next";

export default function AllPatientScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const patients = useSelector((state) => state.patientDataObject.patients);
  const { t } = useTranslation("healthcare");

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("all_patient"),
    });
  });

  function containerColor(status) {
    return status === COMPLIANCE_STATUS.GOOD
      ? theme.colors.greenContainer
      : status === COMPLIANCE_STATUS.MODERATE
      ? theme.colors.yellowContainer
      : theme.colors.errorContainer;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsetsF
      >
        <Searchbar
          placeholder={t("search")}
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={{ marginTop: 8, marginBottom: 16 }}
        />

        {filteredPatients.map((patient, i) => {
          return (
            <HorizontalCard
              key={i}
              profilePic={patient.profile_pic_url}
              subject={capitalizeFirstLetter(patient.first_name)}
              date={t(patient.compliance_status)}
              color={containerColor(patient.compliance_status)}
              cardType={HORIZONTAL_CARD_TYPE.PATIENT}
              onPressedCallback={() =>
                navigation.navigate("PatientDetailsScreen", {
                  patient: patient,
                })
              }
            />
          );
        })}
        <View style={{ marginBottom: 56 }} />
      </ScrollView>
    </View>
  );
}
