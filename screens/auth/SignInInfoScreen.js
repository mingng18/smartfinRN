import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SignInInfoScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Sign In Credentials",
    });
  }, [navigation]);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <TextInput
        mode="outlined"
        label="Email"
        placeholder="Type your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        maxLength={100}
      />
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label="Password"
        placeholder="Type your password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        maxLength={100}
      />
      <Text
        variant="bodySmall"
        style={{ marginTop: 4, color: theme.colors.onSurface }}
      >
        Your password should consist of a combination of alphabets, numbers, and
        symbols.
      </Text>
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label="Confirm Password"
        placeholder="Retype your password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        maxLength={100}
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("PersonalInformationScreen")}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
