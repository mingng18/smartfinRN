import React from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HealthcareBottomNavBar from "./HealthcareBottomNavBar";

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
      {/* <HealthcareStackGroup.Screen
                name="HealthcareProfileScreen"
                component={HealthcareProfileScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcareAppointmentScreen"
                component={HealthcareAppointmentScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcareAppointmentDetailsScreen"
                component={HealthcareAppointmentDetailsScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcarePatientsScreen"
                component={HealthcarePatientsScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcarePatientDetailsScreen"
                component={HealthcarePatientDetailsScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcareVideosScreen"
                component={HealthcareVideosScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcareVideoDetailsScreen"
                component={HealthcareVideoDetailsScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            />
            <HealthcareStackGroup.Screen
                name="HealthcareSideEffectsScreen"
                component={HealthcareSideEffectsScreen}
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                }}
            /> */}
    </HealthcareStack.Navigator>
  );
}
