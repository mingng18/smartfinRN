import {View, Text} from "react-native"
import { Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { logoutDeleteNative } from "../../store/redux/authSlice";



function PatientProfileScreen() {
  const navigation = useNavigation();

  const auth = getAuth();
  const dispatch = useDispatch();


function signOutHandler() {
  
  signOut(auth)
    .then(async () => {
      // Sign out successful
      console.log("User signed out successfully");
      dispatch(logoutDeleteNative());
      // navigation.navigate("Login");
      // Add any additional logic or navigation here
    })
    .catch((error) => {
      // An error occurred during sign out
      console.error("Error signing out:", error);
      // Handle the error or display an error message
    });
}
  return (
    <View>
      <Text>PatientProfileScreen</Text>
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}></View>
      <Button
        onPress={() => signOutHandler()}
      >
        Logout
      </Button>
    </View>
  )
}

export default PatientProfileScreen;
