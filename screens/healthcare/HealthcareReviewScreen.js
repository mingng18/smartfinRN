import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import HorizontalCard from "../../components/ui/HorizontalCard";
import { capitalizeFirstLetter } from "../../util/wordUtil";
import { useNavigation } from "@react-navigation/native";

export default function HealthcareReviewScreen() {
  const theme = useTheme();
  const videos = useSelector((state) => state.videoObject.videos);
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Text variant="titleLarge" style={{ marginTop: 54, marginBottom: 16 }}>
          Review Video
        </Text>
        {videos.length > 0 ? (
          videos.map((video, i) => {
            return (
              <HorizontalCard
                key={`review-${i}`}
                cardType={"video"}
                profilePic={video.patient_profile_picture}
                subject={capitalizeFirstLetter(video.patient_first_name)}
                status=""
                date={new Date(video.uploaded_timestamp)
                  .toISOString()
                  .slice(0, 10)}
                time={new Date(video.uploaded_timestamp).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
                color={theme.colors.surfaceContainer}
                onPressedCallback={() => {
                  navigation.navigate("ReviewVideoDetailsScreen", {
                    video: video,
                  });
                }}
              />
            );
          })
        ) : (
          <Text variant="bodyLarge">All the video had been reviewed!</Text>
        )}
      </ScrollView>
    </View>
  );
}
