import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  Image,
} from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ToDoCard from "../../components/ui/ToDoCard";
import React, { useCallback, useMemo, useRef } from "react";
import CTAButton from "../../components/ui/CTAButton";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheet,
} from "@gorhom/bottom-sheet";

function PatientHomeScreen() {
  const { navigate } = useNavigation();
  const theme = useTheme();

  //TODO: update each details
  const [toDoDetails, setToDoDetails] = React.useState([
    {
      title: "You haven’t take\nmedication yet today",
      icon: "medical-bag",
      count: "0",
      onPressedCallback: handlePresentModalPress,
    },
    {
      title: "Appointment",
      icon: "calendar",
      count: "4",
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

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["30%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClosePress = () => bottomSheetModalRef.current.close();

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView>
        {/* <ScrollView automaticallyAdjustKeyboardInsets={true}> */}
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  source={require("../../assets/blank-profile-pic.png")}
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
                    { backgroundColor: theme.colors.surface },
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
                            onPressedCallback={handlePresentModalPress}
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
                      onPressedCallback={() =>
                        navigate("PreviewVideoScreen", "bruh")
                      }
                    />
                    <CTAButton
                      icon="calendar-blank"
                      title="Make Appointment"
                      color={theme.colors.tertiary}
                      onPressedCallback={() =>
                        navigate("PreviewVideoScreen", "bruh")
                      }
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
                {/* Upload Video Modal */}
                <BottomSheetModal
                  ref={bottomSheetModalRef}
                  index={0}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}
                >
                  <View style={[styles.modalContainer, {}]}>
                    <Text variant="labelLargeProminent">Upload Video</Text>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary,
                        width: "90%",
                        height: 1,
                        marginVertical: 8,
                      }}
                    />
                    <Button
                      mode="text"
                      onPress={() => {
                        navigate("PreviewVideoScreen");
                        bottomSheetModalRef.current.close();
                      }}
                    >
                      Upload Video from Storage
                    </Button>
                    <Button mode="text" onPress={() => {}}>
                      Take Video
                    </Button>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary,
                        width: "90%",
                        height: 1,
                        marginVertical: 8,
                      }}
                    />
                    <Button mode="text" onPress={handleClosePress}>
                      Cancel
                    </Button>
                  </View>
                </BottomSheetModal>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* </ScrollView> */}
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
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
  modalContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
