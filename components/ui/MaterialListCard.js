import { useCallback, useState } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";
import YoutubePlayer from "react-native-youtube-iframe";

export default function MaterialListCard({ title, description, videoId }) {
  const [playing, setPlaying] = useState(false);

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
    </List.Accordion>
  );
}
