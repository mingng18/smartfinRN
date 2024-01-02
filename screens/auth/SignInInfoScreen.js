import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { createUser } from "../../util/firebaseAuth";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { useDispatch } from "react-redux";

import {
  updateSignInCredentials,
  updateSignupMode,
} from "../../store/redux/signupSlice";

export default function SignInInfoScreen({ route }) {
  const { signUpMode } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();
  const { params } = useRoute();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  async function nextButtonHandler() {
    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const confirmPasswordIsValid = password === confirmPassword;
    if (!emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmPassword: !confirmPasswordIsValid,
      });
      return Alert.alert(
        "Invalid input",
        "Please check your entered credentials."
      );
    }
    setIsAuthenticating(true);
    try {
      dispatch(updateSignInCredentials({ email: email, password: password }));
      dispatch(updateSignupMode({ signupMode: signUpMode }));
      if (signUpMode === "patient") {
        navigation.navigate("PersonalInformationScreen");
      } else {
        navigation.navigate("HealthcareInformationScreen");
      }
    } catch (error) {
      Alert.alert(
        "Signup failed, please check your input and try again later."
      );
      console.log(error); //Debug use
    } finally {
      setIsAuthenticating(false);
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Sign In Credentials",
    });
  }, [navigation]);

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
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
        label="Email"
        placeholder="Type your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        maxLength={100}
        error={credentialsInvalid.email}
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
          onPress={() => nextButtonHandler(email, password)}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
