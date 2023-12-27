import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "react-native-paper";

export default function CustomDropDownPicker({
  open,
  setOpen,
  value,
  setValue,
  items,
  setItems,
  placeholder,
}) {
  const theme = useTheme();
  return (
    <DropDownPicker
      style={[
        {
          backgroundColor: theme.colors.background,
          borderRadius: 4,
          borderColor: theme.colors.outline, 
        },
      ]}
      arrowIconStyle={{
        width: 24,
        height: 24,
        marginRight: 4,
        color: theme.colors.outline,
      }}
      tickIconStyle={{
        width: 24,
        height: 24,
        marginRight: 4,
        color: theme.colors.outline,
      }}
      dropDownContainerStyle={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.outline,
      }}
      textStyle={{
        fontFamily: "DMSans-Regular",
        fontSize: 16,
        color: theme.colors.onSurface,
        marginLeft: 4,
      }}
      labelStyle={{
        marginLeft: 4,
        fontFamily: "DMSans-Regular",
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
      }}
      placeholder={placeholder}
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      setItems={setItems}
    />
  );
}
