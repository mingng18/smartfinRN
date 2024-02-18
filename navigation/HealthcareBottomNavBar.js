import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HealthcareHomeScreen from "../screens/healthcare/HealthcareHomeScreen";
import HealthcareAppointmentScreen from "../screens/healthcare/HealthcareAppointmentScreen";
import HealthcareProfileScreen from "../screens/healthcare/HealthcareProfileScreen";
import HealthcareReviewScreen from "../screens/healthcare/HealthcareReviewScreen";
import { useTranslation } from "react-i18next";

const Tab = createMaterialBottomTabNavigator();

const HealthcareBottomNavBar = () => {
  const theme = useTheme();
  const { t } = useTranslation("healthcare");

  //Routes for Bottom Nav Bar
  const routes = [
    {
      index: 0,
      key: "healthcareHome",
      title: t("home"),
      focusedIcon: "home",
      component: HealthcareHomeScreen,
      unfocusedIcon: "home-outline",
    },
    {
      index: 1,
      key: "healthcareReview",
      title: t("review"),
      focusedIcon: "eye",
      component: HealthcareReviewScreen,
      unfocusedIcon: "eye-outline",
    },
    {
      index: 2,
      key: "healthcareAppointment",
      title: t("appointment"),
      focusedIcon: "calendar-blank",
      component: HealthcareAppointmentScreen,
      unfocusedIcon: "calendar-blank-outline",
    },
    {
      index: 3,
      key: "healthcareProfile",
      title: t("profile"),
      focusedIcon: "account",
      component: HealthcareProfileScreen,
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
      initialRouteName="healthcareHome"
      backBehavior="none"
    >
      {routes.map((route) => (
        <Tab.Screen
          key={route.index}
          name={route.key}
          component={route.component}
          options={{
            headerShown: false,
            tabBarLabel: route.title,
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

export default HealthcareBottomNavBar;
