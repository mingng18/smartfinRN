import { Alert, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, useTheme } from "react-native-paper";
import React, { useState, useMemo } from "react";
import TextListButton from "../../../components/ui/TextListButton";
import { useNavigation } from "@react-navigation/native";
import { LANGUAGE } from "../../../constants/constants";

export default function LanguageScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [language, setLanguage] = React.useState(LANGUAGE.ENGLISH);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Language",
    });
  });

  const handleLanguageSubmission = () => {
    //TODO submit new language
    Alert.alert(
      "Change Language",
      "Are you sure want to change language?",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
          style: "cancel",
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
        }}
      >
        <RadioButton.Group
          value={language}
          onValueChange={(value) => setLanguage(value)}
        >
          <View style={styles.row}>
            <Text variant="bodyLarge">English</Text>
            <RadioButton.Android value={LANGUAGE.ENGLISH} />
          </View>
          <View style={styles.row}>
            <Text variant="bodyLarge">Bahasa Melayu</Text>
            <RadioButton.Android value={LANGUAGE.BAHASA_MELAYU} />
          </View>
          <View style={styles.row}>
            <Text variant="bodyLarge">Bahasa Indo</Text>
            <RadioButton.Android value={LANGUAGE.BAHASA_INDONESIA} />
          </View>
        </RadioButton.Group>
        <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
          <Button
            mode="contained"
            onPress={() => {
              handleLanguageSubmission();
            }}
          >
            Update
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
