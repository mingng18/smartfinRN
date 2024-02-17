import { ResizeMode, Video } from "expo-av";
import { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import Pdf from "react-native-pdf";
import YoutubePlayer from "react-native-youtube-iframe";

export default function MaterialListCard({
  title,
  description,
  videoId,
  videoSource,
  pdfSource,
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const theme = useTheme();

  const onStateChange = useCallback(
    (state) => {
      if (state === "ended") {
        setPlaying(false);
      }
    },
    [playing]
  );

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <List.Accordion title={title} titleNumberOfLines={10}>
      <List.Item
        description={`${description}`}
        descriptionNumberOfLines={10}
        style={{ marginTop: -20, paddingTop: 0, paddingLeft: 16 }}
      />
      {videoId ? (
        <View style={{ marginVertical: 30 }}>
          <YoutubePlayer
            height={200}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
        </View>
      ) : null}
      {videoSource ? (
        <Video
          ref={videoRef}
          style={[styles.video]}
          source={videoSource}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
      ) : null}
      {pdfSource ? (
        <Pdf
          trustAllCerts={false}
          source={{ uri: pdfSource }}
          style={[styles.pdf, { backgroundColor: theme.colors.background }]}
        />
      ) : null}
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    width: "100%",
    height: (Dimensions.get("window").width * 9) / 16,
    // aspectRatio: 9 / 16,
  },
  pdf: {
    flex: 1,
    alignSelf: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
