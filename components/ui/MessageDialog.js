import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function MessageDialog({
  visible,
  close,
  title,
  content,
  buttonText,
}) {
  <Portal>
    <Dialog onDismiss={close} visible={visible} dismissable={false}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text>{content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close}>{buttonText}</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>;
}
