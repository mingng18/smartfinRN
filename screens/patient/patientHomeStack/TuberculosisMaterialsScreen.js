import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, List, Searchbar, Text, useTheme } from "react-native-paper";
import TextListButton from "../../../components/ui/TextListButton";

export default function TuberculosisMaterialsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "TB Materials",
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
  ];

  const filteredAccordionData = accordionData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function ListCard({ title, description }) {
    return (
      <List.Accordion title={title} titleNumberOfLines={10}>
        <List.Item
          description={`${description}`}
          descriptionNumberOfLines={10}
          style={{ marginTop: -20, paddingTop: 0, paddingLeft: 16 }}
        />
      </List.Accordion>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
      }}
    >
      <ScrollView automaticallyAdjustKeyboardInsets>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={{ marginTop: 16 }}
        />
        <List.Section>
          {filteredAccordionData.map((item, index) => (
            <ListCard
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </List.Section>
        <View style={{ flexDirection: "row", marginTop: 24 }}>
          <Text variant="titleLarge">More Materials</Text>
          {/* <Button
            mode="contained"
            onPress={() => navigate("")}
          >
            More Materials
          </Button> */}
        </View>
        <View
          style={{ flexDirection: "row", marginVertical: 16, flexWrap: "wrap" }}
        >
          <TextListButton
            text={"About TB"}
            onPressCallback={() => null}
          />
          <TextListButton
            text={"MyTBCompanion"}
            onPressCallback={() =>  null}
          />
          
          {/* <Button
            mode="contained-tonal"
            onPress={() => navigate("")}
            style={{ marginRight: 16, marginBottom: 16 }}
          >
            About TB
          </Button>
          <Button
            mode="contained-tonal"
            onPress={() => navigate("")}
            style={{ marginBottom: 16 }}
          >
            About MyTBCompanion
          </Button> */}
        </View>
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
    </View>
  );
}
