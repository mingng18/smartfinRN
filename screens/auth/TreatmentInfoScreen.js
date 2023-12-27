import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Pressable, View, Alert } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import CustomDropDownPicker from "../../components/ui/CustomDropDownPicker";

export default function TreatmentInfoScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { key, name, params, path } = useRoute();
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const [diagnosisDate, setDiagnosisDate] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Treatment Information",
    });
  });

  //Calendar
  const onDismissSingle = React.useCallback(() => {
    setCalendarOpen(false);
  }, [setCalendarOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setCalendarOpen(false);

      //Format iosDate to date
      const dateObject = new Date(params.date);
      const formattedDate = `${dateObject.getFullYear()}-${(
        dateObject.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
      // console.log(formattedDate);
      setDiagnosisDate(formattedDate);
    },
    [setCalendarOpen, setDiagnosisDate]
  );

  //Diagnosis Drop down
  const [diagnosisOpen, setDiagnosisOpen] = React.useState(false);
  const [diagnosis, setDiagnosis] = React.useState("SPPTB");
  const [diagnosisData, setDiagnosisData] = React.useState([
    { label: "Smear positive pulmonary tuberculosis (SPPTB)", value: "SPPTB" },
    { label: "Smear negative pulmonary tuberculosis (SNPTB)", value: "SNPTB" },
    { label: "Extrapulmonary tuberculosis (EXPTB)", value: "EXPTB" },
    { label: "Latent TB infection (LTBI)", value: "LTBI" },
  ]);

  //Treatment Drop down
  const [treatmentOpen, setTreatmentOpen] = React.useState(false);
  const [treatment, setTreatment] = React.useState(0);
  const [treatmentData, setTreatmentData] = React.useState([
    { label: "Akurit-4 (EHRZ Fixed dose combination)", value: 0 },
    { label: "Akurit (HR Fixed dose combination)", value: 1 },
    { label: "Pyridoxine 10mg", value: 2 },
    // Add more treatment options as needed
  ]);

  //TODO Handle Submission
  const handleFinishSignUpSubmission = () => {
    Alert.alert(
      "Sign Up Successful!",
      "You can now use our app!",
      [
        {
          text: "Go to home page",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="titleLarge" style={{ marginTop: 16 }}>
        My Diagnosis
      </Text>
      <Pressable onPress={() => setCalendarOpen(true)}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            style={{ marginVertical: 16 }}
            label="Date of Diagnosis"
            placeholder="Starting date of the symptoms"
            value={diagnosisDate}
            right={
              <TextInput.Icon
                icon="calendar-blank"
                color={theme.colors.onBackground}
              />
            }
            maxLength={20}
          />
        </View>
      </Pressable>
      <CustomDropDownPicker
        open={diagnosisOpen}
        setOpen={setDiagnosisOpen}
        value={diagnosis}
        setValue={setDiagnosis}
        items={diagnosisData}
        setItems={setDiagnosisData}
        placeholder="Diagnosis"
      />
      <TextInput
        mode="outlined"
        label="Duration of Diagnosis (months)"
        style={{ marginTop: 16 }}
        placeholder="2"
        maxLength={2}
      />
      <Text variant="titleLarge" style={{ marginTop: 32, marginBottom: 16 }}>
        My Current Treatment
      </Text>
      <CustomDropDownPicker
        open={treatmentOpen}
        setOpen={setTreatmentOpen}
        value={treatment}
        setValue={setTreatment}
        items={treatmentData}
        setItems={setTreatmentData}
        placeholder="Treatment"
      />
      <TextInput
        mode="outlined"
        label="Number of Tablets"
        style={{ marginTop: 16 }}
        placeholder="5"
        maxLength={2}
      />
      <View style={{ marginTop: 40, flexDirection: "row-reverse" }}>
        <Button
          mode="contained"
          onPress={() => handleFinishSignUpSubmission()}
          style={{ marginLeft: 16 }}
        >
          Sign Up
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Back
        </Button>
      </View>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={calendarOpen}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
        presentationStyle="pageSheet"
      />
    </View>
  );
}
