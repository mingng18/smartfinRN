import React from "react";
import MaterialListCard from "../../../components/ui/MaterialListCard";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, Searchbar, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function AboutTBScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("more_tb_materials"),
    });
  });

  const accordionData = [
    {
      title: t("tb_definition_title"),
      description: t("tb_definition_description"),
    },
    {
      title: t("tb_signs_symptoms_title"),
      description: t("tb_signs_symptoms_description"),
    },
    {
      title: t("tb_spread_title"),
      description: t("tb_spread_description"),
    },
    {
      title: t("tb_cure_title"),
      description: t("tb_cure_description"),
    },
    {
      title: t("tb_dot_title"),
      description: t("tb_dot_description"),
    },
    {
      title: t("tb_vot_title"),
      description: t("tb_vot_description"),
    },
    {
      title: t("video_example_title"),
      description: t("video_example_description"),
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
