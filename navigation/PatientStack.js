import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import PreviewVideoScreen from "../screens/patient/patientHomeStack/PreviewVideoScreen";
import PatientBottomNavBar from "./PatientBottomNavBar";
import { useTheme } from "react-native-paper";
import CustomAppBar from "../components/ui/CustomAppBar";

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
          options={{ headerShown: true, presentation: "fullScreenModal", tabBarStyle: {
            display: "none",
          },
          tabBarButton: () => null,}}
        />
      </PatientStack.Navigator>
    );
  }
  