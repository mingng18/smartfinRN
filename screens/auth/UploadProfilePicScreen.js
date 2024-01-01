import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function UploadProfilePicScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Picture",
    });
  });

  const pickImage = async () => {
    //No permission when launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      navigation.navigate("PreviewProfilePicScreen", {uri: uri});
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16, marginBottom: 40 }}>
        Upload your profile picture
      </Text>
      <Image
        source={require("../../assets/blank-profile-pic.png")}
        style={{
          borderRadius: 800 / 2,
          alignSelf: "center",
          paddingVertical: 16,
        }}
      />

      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button mode="contained" onPress={pickImage} style={{ marginLeft: 16 }}>
          Upload
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.navigate("CameraScreen");
          }}
          style={{ marginLeft: 16 }}
        >
          Take Picture
        </Button>
        <Button onPress={() => navigation.navigate("TreatmentInfoScreen")}>
          Skip
        </Button>
      </View>
    </View>
  );
}
