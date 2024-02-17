import React from "react";
import MaterialListCard from "../../../components/ui/MaterialListCard";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, Searchbar, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MEDI_SAMPLE_VIDEO } from "../../../constants/constants";

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
      title: t("mytbcompanion_title"),
      description: t("mytbcompanion_description"),
    },
    {
      title: t("mytbcompanion_do_title"),
      description: t("mytbcompanion_do_description"),
    },
    {
      title: t("register_title"),
      description: t("register_description"),
    },
    {
      title: t("record_upload_title"),
      description: t("record_upload_description"),
    },
    {
      title: t("video_spec_title"),
      description: t("video_spec_description"),
    },
    {
      title: t("report_side_effects_title"),
      description: t("report_side_effects_description"),
    },
    {
      title: t("track_progress_title"),
      description: t("track_progress_description"),
    },
    {
      title: t("make_appointment_title"),
      description: t("make_appointment_description"),
    },
    {
      title: t("set_reminder_title"),
      description: t("set_reminder_description"),
    },
    {
      title: t("use_chatbot_title"),
      description: t("use_chatbot_description"),
    },
    {
      title: t("record_title"),
      description: t("record_description"),
      videoSource: MEDI_SAMPLE_VIDEO,
    },
    {
      title: t("medi_title"),
      description: "",
      videoSource: MEDI_SAMPLE_VIDEO,
    },
    {
      title: t("edit_title"),
      description: t("edit_description"),
    },
    {
      title: t("history_title"),
      description: t("history_description"),
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
              videoSource={item.videoSource}
              pdfSource={item.pdfSource}
            />
          ))}
        </List.Section>
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
    </View>
  );
}
