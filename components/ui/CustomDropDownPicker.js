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
  listMode,
  onChangeValue,
  marginTop,
  marginBottom,
  zIndex,
  zIndexInverse,
}) {
  const theme = useTheme();
  return (
    <DropDownPicker
      listMode={listMode}
      dropDownDirection={listMode && "TOP"}
      onChangeValue={onChangeValue}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      dropDownStyle={{ elevation: 999 }}
      style={[
        {
          backgroundColor: theme.colors.background,
          borderRadius: 4,
          borderColor: theme.colors.outline,
          marginTop: marginTop,
          marginBottom: marginBottom,
        },
      ]}
      arrowIconStyle={{
        width: 24,
        height: 24,
        marginRight: 4,
      }}
      tickIconStyle={{
        width: 24,
        height: 24,
        marginRight: 4,
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
      disabledItemLabelStyle={{
        opacity: 0.5,
      }}
      placeholder={placeholder}
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      setItems={setItems}
      maxHeight={250}
      itemKey="label"
    />
  );
}
