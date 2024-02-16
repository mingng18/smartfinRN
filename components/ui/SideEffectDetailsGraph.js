import React, { forwardRef, useImperativeHandle } from "react";
import {
  BLANK_PROFILE_PIC,
  HORIZONTAL_CARD_TYPE,
} from "../../constants/constants";
import { VictoryPie, VictoryTheme } from "victory-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Portal,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Legend from "./Legend";
import { fetchSideEffectsForPatient } from "../../util/firestoreWR";
import { useSelector } from "react-redux";
import HorizontalCard from "./HorizontalCard";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import { ScrollView } from "react-native-gesture-handler";
import CachedImage from "expo-cached-image";

const SideEffectDetailsGraph = forwardRef((props, ref) => {
  const { t } = useTranslation("healthcare");
  const theme = useTheme();
  const patients = useSelector((state) => state.patientDataObject.patients);
  const [sideEffectSymptoms, setSideEffectSymptoms] = React.useState([]);
  const [currentPatient, setCurrentPatient] = React.useState(null);
  const [legends, setLegend] = React.useState([]);
  const colorContainer = [
    "#4B5C92",
    "#2F628C",
    "#4FB9AF",
    "#DBE1FF",
    "#9E6586",
    "#CEE5FF",
    "#A4C6E0",
    "#FFDAD6",
    "#FAF8F0",
    "#E2E2EC",
    "#757680",
    "#FFFFDD",
    "#E2FDED",
    "#B4C5FF",
    "#87CEEB",
    "#DAD9E0",
    "#4B5C92",
    "#2F628C",
    "#BA1A1A",
    "#DBE1FF",
    "#1E6586",
    "#CEE5FF",
    "#A4C6E0",
    "#FFDAD6",
    "#F8F8E0",
    "#E2E2EC",
    "#757680",
    "#F0E68C",
    "#2F3036",
    "#B4C5FF",
    "#87CEEB",
    "#DAD9E0",
    "#4B5C92",
    "#2F628C",
    "#BA1A1A",
    "#DBE1FF",
  ];

  //Change patient modal
  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setSearchQuery("");
  };

  const filteredPatientList = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useImperativeHandle(ref, () => ({
    fetchData() {
      fetchSideEffectSymptomsNumbersThisMonth("");
    },
  }));

  React.useEffect(() => {
    if (currentPatient) {
      fetchSideEffectSymptomsNumbersThisMonth(currentPatient.id);
    }
  }, [currentPatient]);

  async function fetchSideEffectSymptomsNumbersThisMonth(patientId) {
    try {
      const sideEffectData = await fetchSideEffectsForPatient(patientId);
      const sideEffectCounts = new Map();
      const legendCounts = [];
      let totalCount = 0;

      sideEffectData.forEach((sideEffect) => {
        console.log(sideEffect);
        sideEffect.symptoms.forEach((symptom) => {
          const key = `${t(symptom.label)} : ${t(`grade.${symptom.grade}`)}`;
          const count = sideEffectCounts.get(key) || 0;
          sideEffectCounts.set(
            `${t(symptom.label)} : ${t(`grade.${symptom.grade}`)}`,
            count + 1
          );
          totalCount++;
        });
      });

      // Convert the map to the desired format with percentage values
      const formattedData = Array.from(sideEffectCounts).map(
        ([symptom, count]) => {
          const grade = parseInt(symptom.slice(-1)); // Extract grade from symptom string by taking the last character
          return {
            x: t(symptom),
            y: count,
            grade: grade,
          };
        }
      );

      // Sort the formattedData array by grade in descending order
      formattedData.sort((a, b) => b.grade - a.grade);
      formattedData.sort((a, b) => b.count - a.count);

      // Assign the color to legend
      formattedData.forEach((data, i) => {
        legendCounts.push({ text: data.x, color: colorContainer[i] });
      });

      // Update the state with the formatted data
      setSideEffectSymptoms(formattedData);
      setLegend(legendCounts);
    } catch (error) {
      throw new Error(
        "Failed to fetch side effect of the patient: " + error.message
      );
    }
  }

  return (
    <View>
      <Text
        variant="labelLarge"
        style={{
          paddingTop: 8,
          marginHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {t("number_of_symptoms_this_month", {
          name: "",
        })}
      </Text>
      {currentPatient ? (
        <HorizontalCard
          profilePic={currentPatient.profile_pic_url}
          subject={capitalizeFirstLetter(currentPatient.first_name)}
          status={""}
          date={""}
          time={""}
          color={theme.colors.surfaceContainer}
          style={{ marginHorizontal: 16 }}
          cardType={HORIZONTAL_CARD_TYPE.SIDE_EFFECT_PATIENT}
          iconOnPressedCallBack={showModal}
        />
      ) : (
        <HorizontalCard
          profilePic={""}
          subject={t("no_patient_selected")}
          status={""}
          date={""}
          time={""}
          color={theme.colors.surfaceContainer}
          style={{ marginHorizontal: 16 }}
          cardType={HORIZONTAL_CARD_TYPE.SIDE_EFFECT_PATIENT}
          iconOnPressedCallBack={showModal}
        />
      )}
      {sideEffectSymptoms.length == 0 ? (
        <Text style={{ marginHorizontal: 16 }} variant="bodyLarge">
          {t("no_side_effect_reported")}
        </Text>
      ) : (
        <>
          <Text
            style={{ marginTop: 16, alignSelf: "center" }}
            variant="bodyLarge"
          >
            {t("count_side_effect")}
          </Text>
          <VictoryPie
            // theme={VictoryTheme.material}
            colorScale={colorContainer}
            labels={({ datum }) => `${Math.round(datum.y)}`}
            labelRadius={100}
            style={{ labels: { fontSize: 18, fontFamily: "DMSans-Bold" } }}
            data={sideEffectSymptoms}
          />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ marginVertical: 16, marginLeft: 16 }}
              variant="labelMediumProminent"
            >
              {t("legend")}
            </Text>
            <Text
              style={{ marginVertical: 16, marginLeft: 4 }}
              variant="labelMedium"
            >
              {t("side_effect_grade")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              flexWrap: "wrap",
              paddingHorizontal: 16,
            }}
          >
            {legends.map((legend) => {
              return (
                <Legend
                  key={legend.text}
                  text={legend.text}
                  color={legend.color}
                />
              );
            })}
          </View>
        </>
      )}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            paddingLeft: 24,
            paddingVertical: 40,
            margin: 16,
            borderRadius: 16,
            height: "80%",
          }}
        >
          <Text variant="titleLarge">{t("change_patient")}</Text>
          <Searchbar
            placeholder={t("search")}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ marginVertical: 16, marginRight: 24 }}
          />
          <ScrollView>
            {filteredPatientList.map((patient, i) => {
              return (
                <Pressable
                  key={i}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 8,
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                  onPress={() => {
                    setVisible(false);
                    setSearchQuery("");
                    setCurrentPatient(patient);
                  }}
                >
                  {patient.profile_pic_url === "" ? (
                    <Image
                      source={BLANK_PROFILE_PIC}
                      style={styles.profilePicStyle}
                    />
                  ) : (
                    <CachedImage
                      source={{ uri: patient.profile_pic_url }}
                      cacheKey={`${getLastTenCharacters(
                        patient.profile_pic_url
                      )}-thumb`}
                      defaultSource={BLANK_PROFILE_PIC}
                      style={styles.profilePicStyle}
                      placeholderContent={
                        <ActivityIndicator
                          color={theme.colors.primary}
                          size="small"
                          style={styles.profilePicStyle}
                        />
                      }
                    />
                  )}
                  <Text variant="bodyLarge" style={{ paddingRight: 16 }}>
                    {`${patient.first_name} ${patient.last_name}`}
                  </Text>
                  <View style={{ marginRight: 24 }} />
                </Pressable>
              );
            })}
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
});

export default SideEffectDetailsGraph;

const styles = StyleSheet.create({
  profilePicStyle: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 40 / 2,
  },
});
