import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button, TextInput } from "react-native-paper";
import Input from "./Input";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <View style={{ flexDirection: "column", flexGrow: 1 }}>
      <TextInput
        mode="outlined"
        style={{ height: 56 }}
        label="Email Address"
        placeholder="Type your email"
        onChangeText={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
        keyboardType="email-address"
        isInvalid={emailIsInvalid}
      />
      {/* TODO: remove */}
      {/* {!isLogin && (
          <Input
            label="Confirm Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )} */}
      <TextInput
        mode="outlined"
        style={{ height: 56, marginTop: 16 }}
        label="Password"
        placeholder="Type your password"
        onChangeText={updateInputValueHandler.bind(this, "password")}
        value={enteredPassword}
        secure
        isInvalid={passwordIsInvalid}
      />
      {isLogin ? "" : <TextInput
        mode="outlined"
        style={{ height: 56, marginTop: 16 }}
        label="Confirm Password"
        placeholder="Type your password"
        onChangeText={updateInputValueHandler.bind(this, "confirm password")}
        value={enteredPassword}
        secure
        isInvalid={passwordIsInvalid}
        
      />}
      <Button
        key="forgotPassword"
        mode="text"
        compact
        onPress={() => {}}
        style={{ marginTop: 8, width: "100%", alignItems: "flex-end" }}
      >
        {isLogin ? "Forgot Password?" : ""}
      </Button>
      <View style={{ flexGrow: 1 }} />
      {/* <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        /> */}
      {/* {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )} */}
      <Button mode="contained" onPress={submitHandler} style={{ height: 40 }}>
        {isLogin ? "Log In" : "Sign Up"}
      </Button>
    </View>
  );
}

export default AuthForm;
