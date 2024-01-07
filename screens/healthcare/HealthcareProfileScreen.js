import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { Image, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../util/capsFirstWord";
import TextListButton from "../../components/ui/TextListButton";
import { logoutDeleteNative } from "../../store/redux/authSlice";

export default function HealthcareProfileScreen() {
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);
  const auth = getAuth();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

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
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      <View style={[styles.homeHeader]}>
        <Image
          source={
            user.profile_pic_url
              ? { uri: user.profile_pic_url }
              : BLANK_PROFILE_PIC
          }
          style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            variant="headlineLarge"
            style={[styles.headerText]}
          >
            {`${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(
              user.last_name
            )}`}
          </Text>
        </View>
        <IconButton
          icon="pencil"
          size={24}
          onPress={() => {
            navigate("HealthcareEditProfileScreen");
          }}
        />
      </View>
      <TextListButton
        text={"Language"}
        onPressCallback={() => navigate("LanguageScreen")}
      />
      <Button
        mode="contained"
        style={{ marginTop: 24 }}
        onPress={() => signOutHandler()}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
  },
  headerText: {
    alignSelf: "center",
    flexWrap: "wrap",
  },
});
