import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import PreviewVideoScreen from "../screens/patient/patientHomeStack/PreviewVideoScreen";
import PatientBottomNavBar from "./PatientBottomNavBar";
import { useTheme } from "react-native-paper";
import CustomAppBar from "../components/ui/CustomAppBar";
import ReportSideEffectScreen from "../screens/patient/patientHomeStack/ReportSideEffectScreen";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import AllAppointmentScreen from "../screens/patient/patientHomeStack/AllAppointmentScreen";
import AppointmentDetailsScreen from "../screens/patient/patientHomeStack/AppointmentDetailsScreen";
import BookAppointmentScreen from "../screens/patient/patientHomeStack/BookAppointmentScreen";
import CameraScreen from "../components/ui/CameraScreen";
import VideoDetailsScreen from "../screens/patient/patientHomeStack/VideoDetailsScreen";
import SideEffectDetailsScreen from "../screens/patient/patientHomeStack/SideEffectDetailsScreen";

const PatientStack = createNativeStackNavigator();

export default function PatientStackGroup() {
  const theme = useTheme();

  return (
    <PatientStack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
      
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
          presentation: 'fullScreenModal'
        }}
      />
      <PatientStack.Screen
        name="AllAppointmentScreen"
        component={AllAppointmentScreen}
        options={{
          headerShown: true,
          presentation: 'fullScreenModal'
        }}
      />
      <PatientStack.Screen
        name="AppointmentDetailsScreen"
        component={AppointmentDetailsScreen}
        options={{
          headerShown: true,
          presentation: 'fullScreenModal'
        }}
      />
      <PatientStack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
        options={{
          headerShown: true,
          presentation: 'fullScreenModal'
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
    </PatientStack.Navigator>
  );
}
