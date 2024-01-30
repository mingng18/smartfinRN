import React from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HealthcareBottomNavBar from "./HealthcareBottomNavBar";
import ReviewVideoDetailsScreen from "../screens/healthcare/healthcareStack/ReviewVideoDetailsScreen";
import CustomAppBar from "../components/ui/CustomAppBar";
import LanguageScreen from "../screens/common/LanguageScreen";
import HealthcareEditProfileScreen from "../screens/healthcare/healthcareStack/HealthcareEditProfileScreen";
import ChangePasswordScreen from "../screens/common/ChangePasswordScreen";
import ReviewSideEffectScreen from "../screens/healthcare/healthcareStack/ReviewSideEffectScreen";
// import AllAppointmentRequestScreen from "../screens/healthcare/healthcareStack/AllAppointmentRequestScreen";
import HealthcareAppointmentDetailsScreen from "../screens/healthcare/healthcareStack/HealthcareAppointmentDetailsScreen";
import AllPatientScreen from "../screens/healthcare/healthcareStack/AllPatientScreen";
import PatientDetailsScreen from "../screens/healthcare/healthcareStack/PatientDetailsScreen";
import ReviewSideEffectDetailScreen from "../screens/healthcare/healthcareStack/ReviewSideEffectDetailScreen";
import UserPreviewProfilePicScreen from "../screens/common/UserPreviewProfilePicScreen";
import CameraScreen from "../components/ui/CameraScreen";

const HealthcareStack = createNativeStackNavigator();

export default function HealthcareStackGroup() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // console.log("Current screen:", navigation.getCurrentRoute().name); //for debugging purposes only
    }, [navigation])
  );

  return (
    <HealthcareStack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
      initialRouteName="HealthcareBottomNavBar"
    >
      <HealthcareStack.Screen
        name="HealthcareBottomNavBar"
        component={HealthcareBottomNavBar}
        options={{ headerShown: false }}
      />
      <HealthcareStack.Screen
        name="ReviewVideoDetailsScreen"
        component={ReviewVideoDetailsScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="ReviewSideEffectScreen"
        component={ReviewSideEffectScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="ReviewSideEffectDetailScreen"
        component={ReviewSideEffectDetailScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="HealthcareEditProfileScreen"
        component={HealthcareEditProfileScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ headerShown: true }}
      />
      {/* <HealthcareStack.Screen
        name="AllAppointmentRequestScreen"
        component={AllAppointmentRequestScreen}
        options={{ headerShown: true }}
      /> */}
      <HealthcareStack.Screen
        name="HealthcareAppointmentDetailsScreen"
        component={HealthcareAppointmentDetailsScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="AllPatientScreen"
        component={AllPatientScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="PatientDetailsScreen"
        component={PatientDetailsScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="UserPreviewProfilePicScreen"
        component={UserPreviewProfilePicScreen}
        options={{ headerShown: true }}
      />
      <HealthcareStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </HealthcareStack.Navigator>
  );
}
