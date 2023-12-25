import { View, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();

  return (
    <View >
      <Text>PatientHomeScreen</Text>
      <Button
        onPress={() => {
          navigate("PreviewVideoScreen", "bruh");
        }}
      >
        Upload video
      </Button>
    </View>
  );
}

export default PatientHomeScreen;
