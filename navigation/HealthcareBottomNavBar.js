import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HealthcareHomeScreen from "../screens/healthcare/HealthcareHomeScreen";
import HealthcareAppointmentScreen from "../screens/healthcare/HealthcareAppointmentScreen";
import HealthcareProfileScreen from "../screens/healthcare/HealthcareProfileScreen";
import HealthcareReviewScreen from "../screens/healthcare/HealthcareReviewScreen";

const Tab = createMaterialBottomTabNavigator();

const HealthcareBottomNavBar = () => {
  const theme = useTheme();

  //Routes for Bottom Nav Bar
  const [routes, setRoutes] = React.useState([
    {
      index: 0,
      key: "healthcareHome",
      title: "Home",
      focusedIcon: "home",
      component: HealthcareHomeScreen,
      unfocusedIcon: "home-outline",
    },
    {
      index: 1,
      key: "healthcareReview",
      title: "Review",
      focusedIcon: "eye",
      component: HealthcareReviewScreen,
      unfocusedIcon: "eye-outline",
    },
    {
      index: 2,
      key: "healthcareAppointment",
      title: "Appointment",
      focusedIcon: "calendar-blank",
      component: HealthcareAppointmentScreen,
      unfocusedIcon: "calendar-blank-outline",
    },
    {
      index: 3,
      key: "healthcareProfile",
      title: "Profile",
      focusedIcon: "account",
      component: HealthcareProfileScreen,
      unfocusedIcon: "account-outline",
    },
  ]);

  return (
    <Tab.Navigator
      theme={{
        colors: { secondaryContainer: theme.colors.onPrimaryContainer },
      }}
      barStyle={{ backgroundColor: theme.colors.primary }}
      activeColor={theme.colors.onPrimary}
      inactiveColor={theme.colors.primaryContainer}
      initialRouteName="healthcareReview"
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
