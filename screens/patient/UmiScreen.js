import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, resetMessage } from "../../store/redux/umiChatSlice";
import React from "react";

function UmiScreen() {
  const theme = useTheme();
  const { t } = useTranslation("patient");
  const messages = useSelector((state) => state.umiChatObject.messages);
  const dispatch = useDispatch();
  const [isInitial, setIsInitial] = React.useState(true);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 56,
      }}
    >
      <ScrollView
        style={{
          flexGrow: 1,
          marginVertical: 16,
          // flexDirection: "column-reverse",
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.primaryContainer,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text variant="titleLarge">{t("umi_chatbot")}</Text>
          <Text variant="bodyLarge" style={{ marginTop: 4 }}>
            {t("have_any_problem_chat_now")}
          </Text>
        </View>

        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            isUser={message.isUser}
            content={message.content}
            selection={message.selection}
            setIsInitial={setIsInitial}
          />
        ))}
        {!isInitial && (
          <Button
            style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
            onPress={() => {
              dispatch(resetMessage());
              setIsInitial(true);
            }}
          >
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onPrimary }}
            >
              Start from the beginning
            </Text>
          </Button>
        )}

        {/* <TextInput
          mode="outlined"
          style={{ marginBottom: 16 }}
          placeholder={t("type_your_question_here")}
          right={
            <TextInput.Icon
              icon="arrow-right"
              color={theme.colors.outline}
              onPress={() => {
                // Send message here
              }}
            />
          }
        /> */}
      </ScrollView>
    </View>
  );
}

// const messages = [
//   // { isUser: true, content: "Hello" },
//   {
//     isUser: false,
//     content: "Hi there, how can I help you?",
//     selection: [
//       {
//         title: "1) How to use UMI",
//         respond: "Just click on the messages",
//         nextSelections: [{
//           title: "1.1) How to use UMI",
//           respond: "Just click on the messages",
//         }
//         ,{
//           title: "1.2) How to upload a video",
//           respond: "Bruh",
//         }],
//       },
//       { title: "2) How to upload a video", respond: "Bruh", nextSelections: [
//         {
//           title: "2.1) How to use UMI",
//           respond: "Just click on the messages",
//         },{
//           title: "2.2) How to upload a video",
//           respond: "Bruh",
//         }
//       ]},
//     ],
//   },
// ];

export default UmiScreen;

const ChatBubble = ({ isUser, content, selection, setIsInitial }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 8,
        justifyContent: isUser ? "flex-end" : "flex-start",
        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          backgroundColor: isUser
            ? theme.colors.primaryContainer
            : theme.colors.surfaceContainerHigh,
          padding: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          overflow: "scroll",
        }}
      >
        <Text
          variant="bodyLarge"
          style={{
            // padding: 8,
            // paddingHorizontal: 16,
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: isUser
              ? theme.colors.primaryContainer
              : theme.colors.surfaceContainerHigh,
          }}
        >
          {content}
        </Text>
        {selection &&
          selection.map((item, index) => (
            <Button
              key={index}
              style={{
                alignItems: "flex-start",
                overflow:"visible",
              }}
              onPress={() => {
                dispatch(
                  createMessage({
                    isUser: true,
                    content: item.title,
                    selection: [],
                  })
                );
                dispatch(
                  createMessage({
                    isUser: false,
                    content: item.respond,
                    selection: item.nextSelections,
                  })
                );
                console.log(item.respond);
                setIsInitial(false);
              }}
            >
              {item.title}
            </Button>
          ))}
      </View>
    </View>
  );
};
