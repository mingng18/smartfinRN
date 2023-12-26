import { ActivityIndicator, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function LoadingIndicatorDialog ({ visible, close }) {
    const theme = useTheme();
    return (
      <Portal>
        <Dialog onDismiss={close} visible={visible}>
          <Dialog.Title>Uploading Video</Dialog.Title>
          <Dialog.Content>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator
                color={theme.colors.primary}
                size={48}
                style={{ marginRight: 16 }}
              />
              <Text>Loading.....</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  };
  