import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  Image,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import ToDoCard from "../../components/ui/ToDoCard";
import CTAButton from "../../components/ui/CTAButton";
import UploadVideoModal from "./patientHomeStack/UploadVideoModal";
import { BLANK_PROFILE_PIC } from "../../constants/constants";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();

  useLayoutEffect(() => {
    navigate("AllAppointmentScreen");
  });

  //TODO: update each details
  const [toDoDetails, setToDoDetails] = React.useState([
    {
      title: "You haven’t take\nmedication yet today",
      icon: "medical-bag",
      count: "0",
      onPressedCallback: () => bottomSheetModalRef.current?.present(),
    },
    {
      title: "Appointment",
      icon: "calendar",
      count: "4",
      onPressedCallback: () => navigate("AllAppointmentScreen"),
    },
    {
      title: "Video Call Missed",
      icon: "video",
      count: "2",
    },
    {
      title: "Video Rejected",
      icon: "play",
      count: "2",
    },
  ]);

  // modal ref
  const bottomSheetModalRef = useRef(null);

  // modal callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  return (
    <GestureHandlerRootView>
      {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
      <View
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: "100%",
        }}
      >
        {/* ================ HomeHeader =============== */}
        <View style={[styles.homeHeader]}>
          {/* TODO Change the name to the patients image */}
          <Image
            source={{ uri: BLANK_PROFILE_PIC }}
            style={{ width: 74, height: 74, borderRadius: 74 / 2 }}
          />
          <View style={[styles.headerText]}>
            <Text variant="bodyLarge">Hello, </Text>
            {/* TODO Change the name to the patients name */}
            <Text variant="headlineLarge">Arul</Text>
          </View>
        </View>
        {/* ================ TodoList ============== */}
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
              flexGrow: 1,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          ]}
        >
          <View
            style={[
              styles.toDoList,
              { backgroundColor: theme.colors.surfaceContainerLow },
            ]}
          >
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              To-Do List
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              <ScrollView
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {toDoDetails.map((toDoSingle, index) => {
                  const isLastItem = index === toDoDetails.length - 1;
                  return (
                    <ToDoCard
                      key={toDoSingle.title}
                      title={toDoSingle.title}
                      icon={toDoSingle.icon}
                      count={toDoSingle.count}
                      isLastItem={isLastItem}
                      onPressedCallback={toDoSingle.onPressedCallback}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* ================== CTA buttons ============== */}
          <View
            style={[
              {
                paddingVertical: 16,
              },
            ]}
          >
            <Text
              variant="titleLarge"
              style={{ marginHorizontal: 16, marginTop: 16 }}
            >
              Are you up for something?
            </Text>
            <View style={[{ flexDirection: "row", marginVertical: 16 }]}>
              {/* TODO change the navigation screen for each */}
              <CTAButton
                icon="upload"
                title="Upload Video"
                color={theme.colors.primary}
                onPressedCallback={handlePresentModalPress}
              />
              <CTAButton
                icon="emoticon-sick"
                title="Report Side Effect"
                color={theme.colors.secondary}
                onPressedCallback={() => navigate("ReportSideEffectScreen")}
              />
              <CTAButton
                icon="calendar-blank"
                title="Make Appointment"
                color={theme.colors.tertiary}
                onPressedCallback={() => navigate("BookAppointmentScreen")}
                isLastItem={true}
              />
            </View>
          </View>
          {/* ================== TB Materials ================= */}
          <View
            style={[
              styles.tbMaterial,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Text variant="titleLarge" style={{ marginHorizontal: 16 }}>
              Tuberculosis Materials
            </Text>
            <Text
              variant="bodyLarge"
              style={{ marginHorizontal: 16, marginTop: 8 }}
            >
              Curious about tuberculosis?
            </Text>
            {/* TODO TB Materials */}
            <Button
              mode="contained"
              onPressed={() => {}}
              style={{ margin: 16 }}
            >
              Learn more about TB
            </Button>
          </View>
        </View>
      </View>
      <UploadVideoModal bottomSheetModalRef={bottomSheetModalRef} />
      {/* </ScrollView> */}
    </GestureHandlerRootView>
  );
}

export default PatientHomeScreen;

const styles = StyleSheet.create({
  homeHeader: {
    marginHorizontal: 16,
    marginTop: 56,
    flexDirection: "row",
    marginBottom: 32,
  },
  headerText: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
  },
  toDoList: {
    paddingTop: 16,
    borderRadius: 16,
  },
  tbMaterial: {
    paddingTop: 16,
  },
});
