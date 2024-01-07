import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import {
  updatePassword,
  reauthenticateWithCredential,
  getAuth,
  EmailAuthProvider,
} from "firebase/auth";
import * as Haptics from "expo-haptics";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();
  const auth = getAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    password: false,
    confirmPassword: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Change Password",
    });
  });

  const changePassword = (currentPassword, newPassword) => {
    checkInput();
    const credentials = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    reauthenticateWithCredential(auth.currentUser, credentials)
      .then(() => {
        updatePassword(auth.currentUser, newPassword)
          .then(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Password updated!");
            navigation.goBack();
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Update fail!", `${error}`);
      });
  };

  function checkInput() {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
    const passwordIsValid = passwordRegex.test(password);
    const confirmPasswordIsValid = password === confirmPassword;

    if (!passwordIsValid || !confirmPasswordIsValid) {
      setCredentialsInvalid({
        password: !passwordIsValid,
        confirmPassword: !confirmPasswordIsValid,
      });
      return Alert.alert(
        "Invalid input",
        "Please check your entered password."
      );
    }
  }

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
        error={credentialsInvalid.password}
      />
      <Text
        variant="bodySmall"
        style={{ marginTop: 4, color: theme.colors.onSurface }}
      >
        Your password must contain a combination of letters, numbers, and
        symbols, with at least 6 numbers included.
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
        error={credentialsInvalid.confirmPassword}
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => changePassword(oldPassword, password)}
          style={{ marginLeft: 16 }}
        >
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
