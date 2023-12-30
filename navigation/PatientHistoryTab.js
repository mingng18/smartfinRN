import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import PatientProfileScreen from "../screens/patient/PatientProfileScreen";
import UmiScreen from "../screens/patient/UmiScreen";
import PatientCalendarScreen from "../screens/patient/PatientCalendarScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllAppointmentScreen from "../screens/patient/patientHomeStack/AllAppointmentScreen";
import AllSideEffectScreen from "../screens/patient/patientHomeStack/AllSideEffectScreen";
import { useNavigation } from "@react-navigation/native";

const TopTabs = createMaterialTopTabNavigator();

//Create Bottom Navigation Bar for Patient Module
const PatientHistoryTab = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "History",
    });
  });

  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: "DMSans-Regular",
          textTransform: "capitalize",
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      initialRouteName="Appointment"
      backBehavior="none"
      style={{ margin: 0, padding: 0 }}
    >
      <TopTabs.Screen
        name="Appointment"
        component={AllAppointmentScreen}
        options={{
          headerShown: false,
        }}
      />
      <TopTabs.Screen
        name="Side Effect"
        component={AllSideEffectScreen}
        options={{
          headerShown: false,
        }}
      />
    </TopTabs.Navigator>
  );
};

export default PatientHistoryTab;
