import React from "react";
import MaterialListCard from "../../../components/ui/MaterialListCard";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, Searchbar, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function AboutMyTBScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("my_tb_materials"),
    });
  });

  const accordionData = [
    {
      title: "What is Tuberculosis (TB)?",
      description:
        "Tuberculosis (TB) is an infectious disease that most often affects the lungs. TB is caused by a type of bacteria. It spreads through the air when infected people cough, sneeze, or spit.",
    },
    {
      title: "What are the common signs and symptoms of TB?",
      description:
        "The most common symptoms of TB include:\n• A cough that lasts for more than two (2) weeks\n• Cough with sputum which is occasionally bloodstained\n• Loss of appetite and loss of weight\n• Fever\n• Dyspnea, night sweats, chest pain, and hoarseness of voice.",
    },
    {
      title: "How does TB spread?",
      description:
        "Infection is usually by direct airborne transmission from person to person.",
    },
    {
      title: "Can TB be cured?",
      description:
        "The vast majority of TB cases can be cured when medicines are provided and taken properly.",
    },
    {
      title: "What is Direct Observed Therapy (DOT)?",
      description:
        "DOT is a strategy used to ensure TB patient adherence to and tolerability of the prescribed treatment regimen; a health care worker or another designated person watches the TB patient swallow each dose of the prescribed drugs.",
    },
    {
      title: "What is Video Observed Therapy (VOT)?",
      description:
        "VOT is the use of a videophone or other video/computer equipment to observe tuberculosis (TB) patients taking their medications remotely.",
    },
    {
      title: "Video example",
      description: "Video example",
      videoId: "iee2TATGMyI",
    },
  ];

  const filteredAccordionData = accordionData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
      }}
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets
        style={{
          paddingHorizontal: 16,
        }}
      >
        <Searchbar
          placeholder={t("search")}
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={{ marginTop: 16 }}
        />
        <List.Section>
          {filteredAccordionData.map((item, index) => (
            <MaterialListCard
              key={index}
              title={item.title}
              description={item.description}
              videoId={item.videoId}
            />
          ))}
        </List.Section>
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
    </View>
  );
}
