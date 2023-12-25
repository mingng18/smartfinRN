import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";


function PreviewVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { key, name, params, path } = route;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Upload Video",
    });
  });

  return (
    <View>
      <Text>{params}</Text>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Upload video
      </Button>
    </View>
  );
}

export default PreviewVideoScreen;
