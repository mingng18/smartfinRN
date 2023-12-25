import React from "react";
import { Appbar, Menu, useTheme } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

export default function CustomAppBar({ navigation, route, options, back }) {
  // const [visible, setVisible] = React.useState(false);
  // const openMenu = () => setVisible(true);
  // const closeMenu = () => setVisible(false);
  const theme = useTheme();

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header mode="small" elevated={false} style={{backgroundColor: theme.colors.background}}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />

      {/* <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
      ></Menu> */}
    </Appbar.Header>
  );
}
