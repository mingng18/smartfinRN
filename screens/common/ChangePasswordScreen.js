import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
// import {
//   updatePassword,
//   reauthenticateWithCredential,
//   getAuth,
//   EmailAuthProvider,
// } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { firebase } from "@react-native-firebase/auth";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { key, name, params, path } = useRoute();
  const theme = useTheme();
  // const auth = getAuth();
  const { t } = useTranslation("common");

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    password: false,
    confirmPassword: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("change_password"),
    });
  });

  const changePassword = (currentPassword, newPassword) => {
    checkInput();

    const emailCred = firebase.auth.EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(emailCred)
      .then(() => {
        firebase
          .auth()
          .currentUser.updatePassword(newPassword)
          .then(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t("password_updated"));
            navigation.goBack();
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t("update_fail"), `${error}`);
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
      return Alert.alert(t("invalid_input"), t("check_password"));
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
        label={t("old_password")}
        placeholder={t("old_password_ph")}
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        secureTextEntry
        maxLength={100}
      />
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label={t("password")}
        placeholder={t("password_ph")}
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
        {t("password_requirements")}
      </Text>
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label={t("confirm_password")}
        placeholder={t("confirm_password_ph")}
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
          {t("update")}
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.goBack();
          }}
        >
          {t("cancel")}
        </Button>
      </View>
    </View>
  );
}
