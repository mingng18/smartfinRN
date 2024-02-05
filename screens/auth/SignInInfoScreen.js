import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  updateSignInCredentials,
  updateSignupMode,
} from "../../store/redux/signupSlice";
import auth from "@react-native-firebase/auth";

import { useTranslation } from "react-i18next";

import { createUser } from "../../util/firebaseAuth";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { USER_TYPE } from "../../constants/constants";

export default function SignInInfoScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { params } = useRoute();
  const signupMode = params.signupMode;
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  async function nextButtonHandler() {
    setIsAuthenticating(true);

    //Client side validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
    const passwordIsValid = passwordRegex.test(password);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailIsValid = emailRegex.test(email);
    const confirmPasswordIsValid = password === confirmPassword;

    setCredentialsInvalid({
      email: !emailIsValid,
      password: !passwordIsValid,
      confirmPassword: !confirmPasswordIsValid,
    });

    if (!emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
      if (!emailIsValid && !passwordIsValid) {
        setIsAuthenticating(false);
        return Alert.alert(
          t("invalid_email_and_password"),
          t("valid_email_and_password")
        );
      } else if (!emailIsValid) {
        setIsAuthenticating(false);
        return Alert.alert(t("invalid_email"), t("valid_email"));
      } else if (!passwordIsValid) {
        setIsAuthenticating(false);
        return Alert.alert(t("invalid_password"), t("valid_password"));
      } else if (!confirmPasswordIsValid) {
        setIsAuthenticating(false);
        return Alert.alert(
          t("invalid_confirm_password"),
          t("valid_confirm_password")
        );
      } else {
        setIsAuthenticating(false);
        return Alert.alert(t("invalid_input"), t("valid_input"));
      }
    }
    //Check if email already exists

    const signInMethods = await auth().fetchSignInMethodsForEmail(email);
    if (signInMethods.length > 0) {
      Alert.alert(t("email_existed"), t("email_existed_message"));
      return setIsAuthenticating(false);
    }

    //Local state update and error handling
    try {
      console.log("signUpMode" + signupMode);
      dispatch(updateSignInCredentials({ email: email, password: password }));
      dispatch(updateSignupMode({ signupMode: signupMode }));
      if (signupMode === USER_TYPE.PATIENT) {
        navigation.navigate("PersonalInformationScreen");
      } else {
        navigation.navigate("HealthcareInformationScreen");
      }
    } catch (error) {
      Alert.alert(t("unknown_error"), t("unknown_error_message"));
      console.log(error + " in signInInfoScreen"); //Debug use
    } finally {
      setIsAuthenticating(false);
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("sign_in_title"),
    });
  }, [navigation]);

  if (isAuthenticating) {
    return <LoadingOverlay message={t("creating_user")} />;
  }

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
        label={t("email_label")}
        placeholder={t("email_placeholder")}
        value={email}
        onChangeText={(text) => setEmail(text)}
        maxLength={100}
        error={credentialsInvalid.email}
      />
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label={t("password_label")}
        placeholder={t("password_placeholder")}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={hidePassword}
        right={
          <TextInput.Icon
            icon={hidePassword ? "eye" : "eye-off"}
            style={{ marginTop: 10 }}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
        maxLength={100}
        error={credentialsInvalid.password}
      />
      <Text
        variant="bodySmall"
        style={{ marginTop: 4, color: theme.colors.onSurface }}
      >
        {t("password_requirement")}
      </Text>
      <TextInput
        mode="outlined"
        style={{ marginTop: 16 }}
        label={t("confirm_password_label")}
        placeholder={t("confirm_password_placeholder")}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry={hideConfirmPassword}
        right={
          <TextInput.Icon
            icon={hideConfirmPassword ? "eye" : "eye-off"}
            style={{ marginTop: 10 }}
            onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
          />
        }
        maxLength={100}
        error={credentialsInvalid.confirmPassword}
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => nextButtonHandler(email, password)}
        >
          {t("next_button")}
        </Button>
      </View>
    </View>
  );
}
