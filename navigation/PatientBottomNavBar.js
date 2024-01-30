import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import PatientProfileScreen from "../screens/patient/PatientProfileScreen";
import UmiScreen from "../screens/patient/UmiScreen";
import PatientCalendarScreen from "../screens/patient/PatientCalendarScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import { useTranslation } from "react-i18next";

const Tab = createMaterialBottomTabNavigator();

//Create Bottom Navigation Bar for Patient Module
const PatientBottomNavBar = () => {
  const theme = useTheme();
  const { t } = useTranslation("patient");


  //Routes for Bottom Nav Bar
  const routes = [
    {
      index: 0,
      key: "patientHome",
      title: t("home"), // Update the title here
      focusedIcon: "home",
      component: PatientHomeScreen,
      unfocusedIcon: "home-outline",
    },
    {
      index: 1,
      key: "patientCalendar",
      title: t("my_calendar"), // Update the title here
      focusedIcon: "calendar-blank",
      component: PatientCalendarScreen,
      unfocusedIcon: "calendar-blank-outline",
    },
    {
      index: 2,
      key: "umi",
      title: t("umi"), // Update the title here
      focusedIcon: "robot",
      component: UmiScreen,
      unfocusedIcon: "robot-outline",
    },
    {
      index: 3,
      key: "patientProfile",
      title: t("profile"), // Update the title here
      focusedIcon: "account",
      component: PatientProfileScreen,
      unfocusedIcon: "account-outline",
    },
  ];

  return (
    <Tab.Navigator
      theme={{
        colors: { secondaryContainer: theme.colors.onPrimaryContainer },
      }}
      barStyle={{ backgroundColor: theme.colors.primary }}
      activeColor={theme.colors.onPrimary}
      inactiveColor={theme.colors.primaryContainer}
      // initialRouteName="patientHome"
      backBehavior="none"
      style={{ margin: 0, padding: 0 }}
    >
      {routes.map((route) => (
        <Tab.Screen
          key={route.key}
          name={route.title}
          component={route.component}
          tabBarAccessibilityLabel={route.title}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                source={focused ? route.focusedIcon : route.unfocusedIcon} // Use route.focusedIcon for focused state
                color={color}
                size={24}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default PatientBottomNavBar;
