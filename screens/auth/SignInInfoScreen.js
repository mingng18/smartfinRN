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
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";

export default function SignInInfoScreen({ route }) {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const auth = getAuth();
  const { params } = useRoute();
  const signupMode = params.signupMode;

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
        return Alert.alert("Invalid email and password", "Please enter a valid email address and password.");
      } else if (!emailIsValid) {
        setIsAuthenticating(false);
        return Alert.alert("Invalid email", "Please enter a valid email address.");
      } else if (!passwordIsValid) {
        setIsAuthenticating(false);
        return Alert.alert(
          "Invalid password",
          "Please enter a valid password. Your password must contain a combination of letters, numbers, and symbols, with at least 6 characters."
          );
        } else if (!confirmPasswordIsValid) {
          setIsAuthenticating(false);
          return Alert.alert(
            "Invalid confirm password",
            "Confirm password must match password."
            );
          } else {
            setIsAuthenticating(false);
            return Alert.alert("Invalid input", "Please check your entered credentials.");
      }
      

    }
    //Check if email already exists
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      Alert.alert(
        "Email already exists",
        "Please use another email address or request to reset password in the login page."
      );
      return setIsAuthenticating(false);
    }
    
    //Local state update and error handling
    try {
      console.log("signUpMode"+ signupMode)
      dispatch(updateSignInCredentials({ email: email, password: password }));
      dispatch(updateSignupMode({ signupMode: signupMode }));
      if (signupMode === "patient") {
        navigation.navigate("PersonalInformationScreen");
      } else {
        navigation.navigate("HealthcareInformationScreen");
      }
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Please check your input and try again later."
      );
      console.log(error + " in signInInfoScreen"); //Debug use
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
        secureTextEntry={hidePassword}
        right={
          <TextInput.Icon
            icon= {hidePassword? "eye":"eye-off"}
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
        secureTextEntry={hideConfirmPassword}
        right={
          <TextInput.Icon
            icon= {hideConfirmPassword? "eye":"eye-off"}
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
          Next
        </Button>
      </View>
    </View>
  );
}
