import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSideEffectsAlertHealthcare,
  fetchSideEffectsForPatient,
} from "../../util/firestoreWR";

const initialState = {
  sideEffects: [],
  status: "idle",
  error: null,
};

export const fetchSideEffects = createAsyncThunk(
  "sideEffects/fetchSideEffects",
  async ({ userId, userType }, thunkAPI) => {
    try {
      let sideEffects = [];
      if (userType === "patient") {
        sideEffects = await fetchSideEffectsForPatient(userId);
      } else {
        sideEffects = await fetchSideEffectsAlertHealthcare(userId);
      }

      // Convert non-serializable values to serializable ones and handle null cases
      sideEffects = sideEffects.map((sideEffect) => {
        const updatedSideEffect = {
          ...sideEffect,
          created_timestamp: sideEffect.created_timestamp
            ? sideEffect.created_timestamp.toDate().toISOString()
            : "",
          side_effect_occuring_timestamp:
            sideEffect.side_effect_occuring_timestamp
              ? sideEffect.side_effect_occuring_timestamp.toDate().toISOString()
              : "",
          reviewed_timestamp: sideEffect.reviewed_timestamp
            ? sideEffect.reviewed_timestamp.toDate().toISOString()
            : "",
        };
        return updatedSideEffect;
      });

      return sideEffects;
    } catch (error) {
      console.log("error in appointmentSlice", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sideEffectSlice = createSlice({
  name: "sideEffects",
  initialState: initialState,
  reducers: {
    createSideEffect: (state, action) => {
      const newSideEffect = {
        ...action.payload,
      };
      state.sideEffects.push(newSideEffect);
    },
    deleteSideEffect: (state, action) => {
      state.sideEffects = state.sideEffects.filter(
        (sideEffect) => sideEffect.id !== action.payload.id
      );
    },
    updateSideEffect: (state, action) => {
      const index = state.sideEffects.findIndex(
        (sideEffect) => sideEffect.id === action.payload.id
      );
      console.log( "slice is " + JSON.stringify(state.sideEffects[index]))
      if (index !== -1) {
        state.sideEffects[index] = {
          ...state.sideEffects[index],
          ...action.payload.changes,
        };
      }
    },
    clearSideEffectSlice: (state) => {
      state.sideEffects = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSideEffects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSideEffects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sideEffects = action.payload;
      })
      .addCase(fetchSideEffects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators generated for each case reducer function
export const { createSideEffect, updateSideEffect, deleteSideEffect, clearSideEffectSlice  } = sideEffectSlice.actions;


export default sideEffectSlice.reducer;
