import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import CustomAppBar from "../components/ui/CustomAppBar";
import LoginScreen from "../screens/auth/LoginScreen";
import PersonalInformationScreen from "../screens/auth/PersonalInformationScreen";
import SignInInfoScreen from "../screens/auth/SignInInfoScreen";
import UploadProfilePicScreen from "../screens/auth/UploadProfilePicScreen";
import PreviewProfilePicScreen from "../screens/auth/PreviewProfilePicScreen";
import CameraScreen from "../components/ui/CameraScreen";
import TreatmentInfoScreen from "../screens/auth/TreatmentInfoScreen";
import HealthcareInformationScreen from "../screens/auth/HealthcareInformationScreen";
import ChooseYourAccountType from "../screens/auth/ChooseYourAccountType";

const Stack = createNativeStackNavigator();

export default function FirstTimeLoginStack() {
    const authenticated = useSelector(
      (state) => state.authObject.isAuthenticated
    );
    return (
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomAppBar {...props} />,
          contentStyle: { backgroundColor: useTheme().colors.background },
        }}
      >
        <Stack.Screen
            name="ChooseYourAccountType"
            component={ChooseYourAccountType}
            options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PersonalInformationScreen"
          component={PersonalInformationScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UploadProfilePicScreen"
          component={UploadProfilePicScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="PreviewProfilePicScreen"
          component={PreviewProfilePicScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TreatmentInfoScreen"
          component={TreatmentInfoScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="HealthcareInformationScreen"
          component={HealthcareInformationScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    );
  }