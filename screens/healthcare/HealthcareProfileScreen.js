import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalizeFirstLetter,
  getLastTenCharacters,
} from "../../util/wordUtil";
import TextListButton from "../../components/ui/TextListButton";
import { logoutDeleteNative } from "../../store/redux/authSlice";
import CachedImage from "expo-cached-image";
import { BLANK_PROFILE_PIC } from "../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearPatientDataSlice } from "../../store/redux/patientDataSlice";
import { useTranslation } from "react-i18next";
import auth from "@react-native-firebase/auth";

export default function HealthcareProfileScreen() {
  const theme = useTheme();
  const user = useSelector((state) => state.authObject);
  // const auth = getAuth();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { t } = useTranslation("healthcare");

  function clearLocalData() {
    dispatch(logoutDeleteNative());
    dispatch(clearAppointmentSlice());
    dispatch(clearSideEffectSlice());
    dispatch(clearVideoSlice());
    dispatch(clearSignupSlice());
    dispatch(clearPatientDataSlice());
  }

  function signOutHandler() {
    Alert.alert(t("signing_out"), t("confirm_sign_out"), [
      {
        text: t("sign_out"),
        onPress: () => {
          auth()
            .signOut()
            .then(() => {
              console.log("User signed out!");
              clearLocalData();
            })
            .catch((error) => {
              // An error occurred during sign out
              console.error("Error signing out:", error);
            });
        },
      },
      {
        text: t("cancel"),
        style: "cancel",
      },
    ]);
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      <View style={[styles.homeHeader]}>
        {user.profile_pic_url && user.profile_pic_url !== "" ? (
          <CachedImage
            source={{ uri: user.profile_pic_url }}
            cacheKey={`${getLastTenCharacters(user.profile_pic_url)}`}
            defaultSource={BLANK_PROFILE_PIC}
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
        ) : (
          <Image
            source={BLANK_PROFILE_PIC}
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
        )}
        <View style={{ flex: 1, justifyContent: "center" }}>
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
        text={t("language")}
        onPressCallback={() => navigate("LanguageScreen")}
      />
      <Button
        mode="contained"
        style={{ marginTop: 24 }}
        onPress={() => signOutHandler()}
      >
        {t("sign_out")}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 16,
    flexWrap: "wrap",
  },
});
