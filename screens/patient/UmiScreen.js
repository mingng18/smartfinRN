import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, resetMessage } from "../../store/redux/umiChatSlice";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function UmiScreen() {
  const theme = useTheme();
  const { t } = useTranslation("patient");
  const messages = useSelector((state) => state.umiChatObject.messages);
  const dispatch = useDispatch();
  const [isInitial, setIsInitial] = React.useState(true);
  const scrollRef = React.useRef(null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
      style={{
        height: "100%",
        paddingHorizontal: 16,
        paddingTop: 40,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          padding: 16,
          borderRadius: 8,
          marginBottom: 8,
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
          scrollRef={scrollRef}
        />
      ))}
      {!isInitial && (
        <>
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
          <View style={{ marginTop: 72 }} />
        </>
      )}
    </ScrollView>
  );
}

export default UmiScreen;

const ChatBubble = ({
  isUser,
  content,
  selection,
  setIsInitial,
  scrollRef,
}) => {
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
                overflow: "visible",
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
                if (scrollRef.current) {
                  scrollRef.current.scrollToEnd({ animated: true });
                }
              }}
            >
              <Text>{item.title}</Text>
            </Button>
          ))}
      </View>
    </View>
  );
};
