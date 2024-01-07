import * as React from "react";
import { useTheme, Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HealthcareHomeScreen from "../screens/healthcare/HealthcareHomeScreen";

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
        focusedIcon: "calendar-blank",
        component: HealthcareHomeScreen,
        unfocusedIcon: "calendar-blank-outline",
    },
    //   {
    //     index: 1,
    //     key: "patientCalendar",
    //     title: "My Calendar",
    //     focusedIcon: "calendar-blank",
    //     component: PatientCalendarScreen,
    //     unfocusedIcon: "calendar-blank-outline",
    //   },
    //   {
    //     index: 2,
    //     key: "umi",
    //     title: "Umi",
    //     focusedIcon: "robot",
    //     component: UmiScreen,
    //     unfocusedIcon: "robot-outline",
    //   },
    //   {
    //     index: 3,
    //     key: "patientProfile",
    //     title: "Profile",
    //     focusedIcon: "account",
    //     component: PatientProfileScreen,
    //     unfocusedIcon: "account-outline",
    //   },
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
    >
      {routes.map((route) => (
        <Tab.Screen
          key={route.index}
          name={route.key}
          component={route.component}
          options={{
            tabBarLabel: route.title,
            tabBarIcon: ({ focused }) => (
              <Icon
                name={focused ? route.focusedIcon : route.unfocusedIcon}
                color={
                  focused
                    ? theme.colors.onPrimary
                    : theme.colors.primaryContainer
                }
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
