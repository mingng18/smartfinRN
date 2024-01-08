import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVideosForPatient,
  fetchVideosToBeReviewedForHealthcare,
} from "../../util/firestoreWR"; // You should replace this with the actual function to fetch video data

const initialState = {
  videos: [],
  status: "idle",
  error: null,
};

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async ({ userId, userType }, thunkAPI) => {
    let videos = [];
    try {
      if (userType === "patient") {
        videos = await fetchVideosForPatient(userId); // Fetch video data from Firestore or any other source for patient
      } else {
        videos = await fetchVideosToBeReviewedForHealthcare(userId); // Fetch video data from Firestore or any other source for healthcare
      }

      // Convert non-serializable values to serializable ones if needed
      videos = videos.map((video) => {
        const updatedVideo = {
          ...video,
          reviewed_timestamp: video.reviewed_timestamp
            ? video.reviewed_timestamp.toDate().toISOString()
            : "",
          uploaded_timestamp: video.uploaded_timestamp
            ? video.uploaded_timestamp.toDate().toISOString()
            : "",
        };
        return updatedVideo;
      });

      return videos;
    } catch (error) {
      console.log("Error fetching videos: " + error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const videoSlice = createSlice({
  name: "videos",
  initialState: initialState,
  reducers: {
    createVideo: (state, action) => {
      const newVideo = {
        ...action.payload,
      };
      state.videos.push(newVideo);
    },
    deleteVideo: (state, action) => {
      state.videos = state.videos.filter(
        (video) => video.id !== action.payload
      );
    },
    updateVideo: (state, action) => {
      const index = state.videos.findIndex(
        (video) => video.id === action.payload.id
      );
      if (index !== -1) {
        state.videos[index] = {
          ...state.videos[index],
          ...action.payload.changes,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators generated for each case reducer function
export const { createVideo, deleteVideo } = videoSlice.actions;
export const updateVideo = videoSlice.actions.updateVideo;

export default videoSlice.reducer;
