import React, { forwardRef, useImperativeHandle } from "react";
import { FIREBASE_COLLECTION } from "../../constants/constants";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from "victory-native";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";
import { fetchCollection } from "../../util/firestoreWR";

const VideoSubmittedGraph = forwardRef((props, ref) => {
  const [videoAnalytic, setVideoAnalytic] = React.useState([]);
  const { t } = useTranslation("healthcare");
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    fetchData() {
      fetchVideoSubmittedThisMonth();
    },
  }));

  async function fetchVideoSubmittedThisMonth() {
    try {
      const videoData = await fetchCollection(FIREBASE_COLLECTION.VIDEO);
      const videoCountByDay = new Map();
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the number of days in the current month

      // Initialize videoCountByDay with 0 for all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        videoCountByDay.set(day, 0);
      }

      videoData.forEach((video) => {
        const videoDate = video.uploaded_timestamp.toDate();

        if (
          videoDate.getMonth() === currentMonth &&
          videoDate.getFullYear() === currentYear
        ) {
          const day = videoDate.getDate();
          videoCountByDay.set(day, videoCountByDay.get(day) + 1);
        }
      });

      // Convert the map to the desired format
      const formattedData = Array.from(videoCountByDay).map(([x, y]) => ({
        x,
        y,
      }));
      // console.log("video length is " + JSON.stringify(formattedData));
      setVideoAnalytic(formattedData);
    } catch (error) {
      throw new Error("Failed to fetch collection size: " + error.message);
    }
  }

  return (
    <>
      <Text
        variant="labelLarge"
        style={{
          paddingTop: 4,
          marginHorizontal: 16,
        }}
      >
        {t("number_of_videos_submitted_this_month", {
          month: t(new Date().getMonth()),
        })}
      </Text>
      <VictoryChart theme={VictoryTheme.material}>
        {/* X Axis */}
        <VictoryAxis
          label={t("date")}
          axisLabelComponent={<VictoryLabel dy={20} />}
        />
        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          label={t("number_of_videos")}
          axisLabelComponent={<VictoryLabel dy={-16} />}
          tickFormat={(tick) => {
            return Number.isInteger(tick) ? tick.toString() : "";
          }}
        />
        <VictoryBar
          data={videoAnalytic}
          style={{
            data: { fill: theme.colors.primary },
          }}
        />
      </VictoryChart>
    </>
  );
});

export default VideoSubmittedGraph;
