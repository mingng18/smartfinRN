import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";
import DropDownPicker from "react-native-dropdown-picker";

export default function HealthcareInformationScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState();

  const [roleOpen, setRoleOpen] = React.useState(false);
  const [role, setRole] = React.useState("doctor");
  const [roleData, setRoleData] = React.useState([
    { label: "Doctor", value: "doctor" },
    { label: "Nurse", value: "nurse" },
  ]);

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [category, setCategory] = React.useState("government_hospital");
  const [categoryData, setCategoryData] = React.useState([
    { label: "Government hospital", value: "government_hospital" },
    { label: "Private Hospital", value: "private_hospital" },
    { label: "NGO", value: "ngo" },
    // Add more category options as needed
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Healthcare Details",
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
      <TextInput
        mode="outlined"
        label="Staff ID"
        maxLength={10}
      />
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        open={roleOpen}
        setOpen={setRoleOpen}
        value={role}
        setValue={setRole}
        items={roleData}
        setItems={setRoleData}
        placeholder="Role"
      />
      <View style={{ marginTop: 16 }} />
      <CustomDropDownPicker
        open={categoryOpen}
        setOpen={setCategoryOpen}
        value={category}
        setValue={setCategory}
        items={categoryData}
        setItems={setCategoryData}
        placeholder="Category"
      />
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
