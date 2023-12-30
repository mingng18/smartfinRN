import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Change Password",
    });
  });

  return (
    <View
      style={{
        paddingHorizontal: 16,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label="Old Password"
        placeholder="Type your old password"
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        secureTextEntry
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
        <Button mode="contained" onPress={() => {}} style={{ marginLeft: 16 }}>
          Update
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}
