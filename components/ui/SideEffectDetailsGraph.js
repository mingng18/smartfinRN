import React, { forwardRef, useImperativeHandle } from "react";
import {
  BLANK_PROFILE_PIC,
  FIREBASE_COLLECTION,
  HORIZONTAL_CARD_TYPE,
} from "../../constants/constants";
import {
  VictoryAxis,
  VictoryBar,
  VictoryLabel,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
} from "victory-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Button,
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
    "#1E6586",
    "#BA1A1A",
    "#DBE1FF",
    "#CEE5FF",
    "#C5E7FF",
    "#FFDAD6",
    "#FAF8F0",
    "#E2E2EC",
    "#757680",
    "#000000",
    "#2F3036",
    "#B4C5FF",
    "#9BCBFB",
    "#DAD9E0",
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

      sideEffectData.forEach((sideEffect) => {
        sideEffect.symptoms.forEach((symptom) => {
          const count = sideEffectCounts.get(symptom.label) || 0;
          sideEffectCounts.set(symptom.label, count + 1);
        });
      });

      // Convert the map to the desired format
      const formattedData = Array.from(sideEffectCounts).map(
        ([symptom, count]) => {
          // console.log("symptom is " + symptom);
          // console.log("symptom is " + t(symptom));
          return {
            x: t(symptom),
            y: count,
          };
        }
      );

      //Assign the color to legend
      formattedData.forEach((data, i) => {
        legendCounts.push({ text: data.x, color: colorContainer[i] });
      });

      // Update the state with the formatted data
      setSideEffectSymptoms(formattedData);
      setLegend(legendCounts);
    } catch (error) {
      throw new Error("Failed to fetch collection size: " + error.message);
    }
  }

  return (
    <View>
      <Text
        variant="labelLarge"
        style={{
          paddingTop: 32,
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
          <VictoryPie
            colorScale={colorContainer}
            style={{ labels: { fontSize: 0 } }}
            data={sideEffectSymptoms}
          />
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
