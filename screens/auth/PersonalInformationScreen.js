import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import DropDownPicker from "react-native-dropdown-picker";

export default function PersonalInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState();

  const [genderOpen, setGenderOpen] = React.useState(false);
  const [gender, setGender] = React.useState(0);
  const [genderData, setGenderData] = React.useState([
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
  ]);

  const [nationalityOpen, setNationalityOpen] = React.useState(false);
  const [nationality, setNationality] = React.useState("Malaysian");
  const [nationalityData, setNationalityData] = React.useState([
    { label: "Malaysian", value: "Malaysian" },
    { label: "Indonesian", value: "Indonesian" },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Personal Information",
    });
  });

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
        }}
      >
        <TextInput
          mode="outlined"
          style={{ flex: 1 }}
          label="First Name"
          placeholder="Muhammad Ali"
          maxLength={100}
        />
        <TextInput
          mode="outlined"
          style={{ flex: 1, marginLeft: 16 }}
          label="Last Name"
          placeholder="Mohammad Abu"
          maxLength={100}
        />
      </View>
      <CustomDropDownPicker
        open={genderOpen}
        setOpen={setGenderOpen}
        value={gender}
        setValue={setGender}
        items={genderData}
        setItems={setGenderData}
        placeholder="Gender"
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 16,
        }}
      >
        <TextInput
          mode="outlined"
          style={{ flex: 1 }}
          label="CC"
          placeholder="+60"
          maxLength={3}
        />
        <TextInput
          mode="outlined"
          style={{ flex: 3, marginLeft: 16 }}
          label="Mobile Phone Number"
          maxLength={10}
        />
      </View>
      <CustomDropDownPicker
        open={nationalityOpen}
        setOpen={setNationalityOpen}
        value={nationality}
        setValue={setNationality}
        items={nationalityData}
        setItems={setNationalityData}
        placeholder="Nationality"
      />
      {nationality == "Malaysian" ? (
        <TextInput
          mode="outlined"
          style={{ marginTop: 16 }}
          label="NRIC"
          placeholder="Type without spacing and -"
          maxLength={12}
        />
      ) : (
        <>
          <TextInput
            mode="outlined"
            style={{ marginTop: 16 }}
            label="Passport Number"
            maxLength={12}
          />
          <TextInput
            mode="outlined"
            style={{ marginTop: 16 }}
            label="Age"
            maxLength={3}
          />
        </>
      )}

      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("UploadProfilePicScreen")}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
