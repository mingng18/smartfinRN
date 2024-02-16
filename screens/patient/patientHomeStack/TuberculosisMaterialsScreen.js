import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, List, Searchbar, Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import MaterialListCard from "../../../components/ui/MaterialListCard";

export default function TuberculosisMaterialsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { t } = useTranslation("patient");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("tb_materials"),
    });
  });

  const accordionData = [
    {
      title: t("tb_definition_title"),
      description: t("tb_definition_description"),
    },
    {
      title: t("tb_spread_title"),
      description: t("tb_spread_description"),
    },
    {
      title: t("tb_dot_title"),
      description: t("tb_dot_description"),
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
        <Text style={{ marginTop: 24 }} variant="titleLarge">
          {t("more_materials")}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 16, flexWrap: "wrap" }}>
          <Button
            mode="contained"
            style={{ marginRight: 16, marginBottom: 16 }}
            onPress={() => navigation.navigate("AboutTBScreen")}
          >
            {t("about_tb")}
          </Button>
          <Button
            mode="contained-tonal"
            style={{ marginBottom: 16 }}
            onPress={() => navigation.navigate("AboutMyTBScreen")}
          >
            {t("about_my_tb_companion")}
          </Button>
        </View>
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
    </View>
  );
}
