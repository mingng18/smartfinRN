import { Chip, Text, useTheme } from "react-native-paper";
import { Pressable, StyleSheet } from "react-native";
import React from "react";
export default function InformationChip({ isBlur = false, text, icon, style }) {
  const theme = useTheme();

  const [isBlurring, setIsBlurring] = React.useState(isBlur);
  const [isDisableBlur, setIsDisableBlur] = React.useState(true);

  React.useLayoutEffect(() => {
    setIsDisableBlur(!isBlur);
  });

  return (
    <Pressable onPress={() => setIsBlurring(!isBlurring)} style={{...style}}>
      {icon ? 
      //Chip with Icon
      (<Chip selected icon={icon} style={{ marginRight: 8, marginBottom: 8 }}>
        {isDisableBlur ? (
          <Text>{text}</Text>
        ) : (
          <Text style={isBlurring ? styles.blurring : styles.noBlurred}>
            {text}
          </Text>
        )}
      </Chip>) : ( 
        //Chip without Icon
        (<Chip style={{ marginRight: 8, marginBottom: 8 }}>
          {isDisableBlur ? (
            <Text>{text}</Text>
          ) : (
            <Text style={isBlurring ? styles.blurring : styles.noBlurred}>
              {text}
            </Text>
          )}
        </Chip>) 
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  blurring: {
    height: 3,
    width: 70,
    shadowOpacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 0.01,
    borderColor: "#CEE5FF",
    backgroundColor: "#CEE5FF"
    // color: "#fff0",
    // textShadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // textShadowRadius: 10,
  },
  noBlurred: {},
});
