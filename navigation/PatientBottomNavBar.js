import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import PatientProfileScreen from "../screens/patient/PatientProfileScreen";
import UmiScreen from "../screens/patient/UmiScreen";
import PatientCalendarScreen from "../screens/patient/PatientCalendarScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";

const Tab = createMaterialBottomTabNavigator();

//Create Bottom Navigation Bar for Patient Module
const PatientBottomNavBar = () => {
  const theme = useTheme();

  //Routes for Bottom Nav Bar
  const [routes, setRoutes] = React.useState([
    {
      index: 0,
      key: "patientHome",
      title: "Home",
      focusedIcon: "home",
      component: PatientHomeScreen,
      unfocusedIcon: "home-outline",
    },
    {
      index: 1,
      key: "patientCalendar",
      title: "My Calendar",
      focusedIcon: "calendar-blank",
      component: PatientCalendarScreen,
      unfocusedIcon: "calendar-blank-outline",
    },
    {
      index: 2,
      key: "umi",
      title: "Umi",
      focusedIcon: "robot",
      component: UmiScreen,
      unfocusedIcon: "robot-outline",
    },
    {
      index: 3,
      key: "patientProfile",
      title: "Profile",
      focusedIcon: "account",
      component: PatientProfileScreen,
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
      initialRouteName="Home"
      backBehavior="none"
      style={{margin: 0, padding: 0}}
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
