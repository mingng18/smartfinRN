import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, Searchbar, Text, useTheme } from "react-native-paper";

export default function TuberculosisMaterialsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQueries, setSearchQuery] = React.useState();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "TB Materials",
    });
  });

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
          value={searchQueries}
          style={{ marginTop: 16 }}
        />
        <List.Section title="Expandable list item">
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
          >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
          </List.Accordion>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Start expanded"
          >
            <List.Item title="List item 1" />
          </List.Accordion>
        </List.Section>
        <View style={{ marginBottom: 54 }} />
      </ScrollView>
    </View>
  );
}
