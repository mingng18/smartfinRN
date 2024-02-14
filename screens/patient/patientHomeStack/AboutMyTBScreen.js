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
      title: "What is MyTBCompanion?",
      description:
        "MyTBCompanion is a mobile health application designed to improve Tuberculosis management among patients and healthcare providers. Its main feature is Video Observed Therapy.",
    },
    {
      title: "What can MyTBCompanion do?",
      description:
        "MyTBCompanion allows users to:\n- Upload self-medication videos\n- Report side effects\n- Book appointments\n- Monitor progress\n- Set medication reminders and receive alerts",
    },
    {
      title: "How should I register?",
      description: "",
    },
    {
      title: "How do I record and upload the video?",
      description: "",
    },
    {
      title: "Is there any specification and requirement of the video?",
      description: "",
    },
    {
      title: "How should I report the side effects of the medication?",
      description: "",
    },
    {
      title: "How should I track the progress of my medication?",
      description: "",
    },
    {
      title: "How should I make an appointment for online consultations?",
      description: "",
    },
    {
      title:
        "How should I set the reminder to remind me to take medications on time?",
      description: "",
    },
    {
      title: "How to use Umi Chatbot?",
      description: "",
    },
    {
      title: "Five things to know about Tuberculosis",
      description: "",
      videoId: "https://www.youtube.com/watch?v=wA_fObLY6GE",
    },
    {
      title: "How the body reacts to Tuberculosis?",
      description: "",
      videoId: "https://www.youtube.com/watch?v=IGZLkRN76Dc",
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
