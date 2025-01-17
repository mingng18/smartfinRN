import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import {
  BLANK_PROFILE_PIC,
  HORIZONTAL_CARD_TYPE,
} from "../../constants/constants";
import CachedImage from "expo-cached-image";
import { getLastTenCharacters } from "../../util/wordUtil";
import { useTranslation } from "react-i18next";

export default function HorizontalCard({
  profilePic,
  subject,
  status,
  date,
  time,
  color,
  onPressedCallback,
  cardType,
  iconOnPressedCallBack,
  style,
}) {
  const theme = useTheme();
  const { t } = useTranslation("common");

  return (
    <View
      style={[
        styles.pressableContainer,
        {
          ...style,
          backgroundColor: color,
        },
      ]}
    >
      <Pressable
        onPress={onPressedCallback}
        android_ripple={{ color: theme.colors.onBackground, borderless: false }}
        style={[styles.cardContainer]}
      >
        {/* {console.log(profilePic)} */}
        {cardType === HORIZONTAL_CARD_TYPE.NO_PIC ? (
          <></>
        ) : (
          profilePic === null ||
          (profilePic === "" ? (
            <Image source={BLANK_PROFILE_PIC} style={styles.profilePicStyle} />
          ) : (
            <CachedImage
              source={{ uri: profilePic }}
              cacheKey={`${getLastTenCharacters(profilePic)}-thumb`}
              defaultSource={BLANK_PROFILE_PIC}
              style={styles.profilePicStyle}
              placeholderContent={
                <ActivityIndicator
                  color={theme.colors.primary}
                  size="small"
                  style={styles.profilePicStyle}
                />
              }
            />
          ))
        )}
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={styles.textContainer}>
            <Text variant="titleMedium">{subject}</Text>
            {cardType !== HORIZONTAL_CARD_TYPE.VIDEO_CALL_APPOINTMENT && (
              <Text variant="labelLarge">{status}</Text>
            )}
          </View>
          <View style={[styles.textContainer, { paddingTop: 0 }]}>
            {cardType !== HORIZONTAL_CARD_TYPE.VIDEO_CALL_APPOINTMENT ? (
              <>
                <Text variant="bodyMedium">{date}</Text>
                <Text variant="bodyMedium">{time}</Text>
              </>
            ) : (
              <>
                <Text variant="bodyMedium">{time}</Text>
              </>
            )}
          </View>
        </View>
        {cardType == HORIZONTAL_CARD_TYPE.VIDEO_CALL_APPOINTMENT && (
          <IconButton
            icon="video-outline"
            size={32}
            onPress={iconOnPressedCallBack}
          />
        )}
        {cardType == HORIZONTAL_CARD_TYPE.PATIENT && (
          <Button mode="outlined" onPress={iconOnPressedCallBack}>
            {t("manage")}
          </Button>
        )}
        {cardType == HORIZONTAL_CARD_TYPE.SIDE_EFFECT_PATIENT && (
          <Button mode="outlined" onPress={iconOnPressedCallBack}>
            {t("change")}
          </Button>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    overflow: "hidden",
    borderRadius: 8,
    marginBottom: 16,
  },
  cardContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 80,
  },
  profilePicStyle: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 40 / 2,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
