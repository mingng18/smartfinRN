import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Chip, Text, TextInput, useTheme } from "react-native-paper";

function UmiScreen() {
  const theme = useTheme();
  const { t } = useTranslation("patient");

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingHorizontal: 16,
          paddingTop: 56,
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
        <ScrollView
          style={{
            flexGrow: 1,
            marginVertical: 16,
            flexDirection: "column-reverse",
          }}
        >
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              isUser={message.isUser}
              content={message.content}
            />
          ))}
        </ScrollView>
        <TextInput
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
/>

      </View>
    </KeyboardAvoidingView>
  );
}

const messages = [
  { isUser: true, content: "Hello" },
  { isUser: false, content: "Hi there" },
];

export default UmiScreen;

const ChatBubble = ({ isUser, content }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 8,
        justifyContent: isUser ? "flex-end" : "flex-start",
        borderRadius: 8,
      }}
    >
      <Text
        variant="bodyLarge"
        style={{
          padding: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: isUser
            ? theme.colors.primaryContainer
            : theme.colors.surfaceContainerHigh,
        }}
      >
        {content}
      </Text>
    </View>
  );
};
