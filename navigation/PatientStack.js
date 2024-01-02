import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PreviewVideoScreen from "../screens/patient/patientHomeStack/PreviewVideoScreen";
import PatientBottomNavBar from "./PatientBottomNavBar";
import { useTheme } from "react-native-paper";
import CustomAppBar from "../components/ui/CustomAppBar";
import ReportSideEffectScreen from "../screens/patient/patientHomeStack/ReportSideEffectScreen";
import AllAppointmentScreen from "../screens/patient/patientHomeStack/AllAppointmentScreen";
import AppointmentDetailsScreen from "../screens/patient/patientHomeStack/AppointmentDetailsScreen";
import BookAppointmentScreen from "../screens/patient/patientHomeStack/BookAppointmentScreen";
import CameraScreen from "../components/ui/CameraScreen";
import VideoDetailsScreen from "../screens/patient/patientHomeStack/VideoDetailsScreen";
import SideEffectDetailsScreen from "../screens/patient/patientHomeStack/SideEffectDetailsScreen";
import ProgressTracker from "../screens/patient/patientHomeStack/ProgressTracker";
import PatientSettingsScreen from "../screens/patient/patientHomeStack/PatientSettingsScreen";
import LanguageScreen from "../screens/patient/patientHomeStack/LanguageScreen";
import PatientHistoryScreen from "../screens/patient/patientHomeStack/PatientHistoryScreen";
import ReminderScreen from "../screens/patient/patientHomeStack/ReminderScreen";
import PatientHistoryTab from "./PatientHistoryTab";
import PatientEditProfileScreen from "../screens/patient/patientHomeStack/PatientEditProfileScreen";
import ChangePasswordScreen from "../screens/patient/patientHomeStack/ChangePasswordScreen";
import PreviewProfilePicScreen from "../screens/auth/PreviewProfilePicScreen";
import TuberculosisMaterialsScreen from "../screens/patient/patientHomeStack/TuberculosisMaterialsScreen";

const PatientStack = createNativeStackNavigator();

export default function PatientStackGroup() {
  const theme = useTheme();

  return (
    <PatientStack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
      initialRouteName="PatientBottomNavBar"
    >
      <PatientStack.Screen
        name="PatientBottomNavBar"
        component={PatientBottomNavBar}
        options={{ headerShown: false }}
      />
      <PatientStack.Screen
        name="PreviewVideoScreen"
        component={PreviewVideoScreen}
        options={{
          headerShown: true,
          presentation: "fullScreenModal",
        }}
      />
      <PatientStack.Screen
        name="ReportSideEffectScreen"
        component={ReportSideEffectScreen}
        options={{
          headerShown: true,
          presentation: "fullScreenModal",
        }}
      />
      <PatientStack.Screen
        name="AllAppointmentScreen"
        component={AllAppointmentScreen}
        options={{
          headerShown: true,
          presentation: "fullScreenModal",
        }}
      />
      <PatientStack.Screen
        name="AppointmentDetailsScreen"
        component={AppointmentDetailsScreen}
        options={{
          headerShown: true,
          presentation: "fullScreenModal",
        }}
      />
      <PatientStack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
        options={{
          headerShown: true,
          presentation: "fullScreenModal",
        }}
      />
      <PatientStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />
      <PatientStack.Screen
        name="VideoDetailsScreen"
        component={VideoDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="SideEffectDetailsScreen"
        component={SideEffectDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="ProgressTracker"
        component={ProgressTracker}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="PatientSettingsScreen"
        component={PatientSettingsScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="PatientHistoryScreen"
        component={PatientHistoryScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="ReminderScreen"
        component={ReminderScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="PatientHistoryTab"
        component={PatientHistoryTab}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="PatientEditProfileScreen"
        component={PatientEditProfileScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="PreviewProfilePicScreen"
        component={PreviewProfilePicScreen}
        options={{
          headerShown: true,
        }}
      />
      <PatientStack.Screen
        name="TuberculosisMaterialsScreen"
        component={TuberculosisMaterialsScreen}
        options={{
          headerShown: true,
        }}
      />
    </PatientStack.Navigator>
  );
}
