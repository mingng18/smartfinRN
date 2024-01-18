import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBookedDateOfAppointmentFromFirebase } from "../../util/firestoreWR";

const initialState = {
  bookedAppointmentDates: [],
  status: "idle",
  error: null,
};

export const fetchBookedAppointmentDates = createAsyncThunk(
  "appointments/fetchBookedAppointmentDates",
  async (thunkAPI) => {
    try {
      // console.log("fetching booked dates");
      const bookedAppointmentDates =
        await fetchBookedDateOfAppointmentFromFirebase();
      // console.log("bookedAppointmentDates", bookedAppointmentDates);
      return bookedAppointmentDates;
    } catch (error) {
      console.log("error in bookedAppointmentDateSlice", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const bookedAppointmentDateSlice = createSlice({
  name: "bookedAppointmentDate",
  initialState,
  reducers: {
    createAppointmentDate: (state, action) => {
      const newAppointment = {
        ...action.payload,
      };
      state.bookedAppointmentDates.push(newAppointment);
    },
    deleteAppointmentDate: (state, action) => {
      const appointmentDateToDelete = action.payload;
      state.bookedAppointmentDates = state.bookedAppointmentDates.filter(
        (appointmentDate) => appointmentDate.id !== appointmentDateToDelete.id
      );
    },
    clearAppointmentDateSlice: (state) => {
      state.bookedAppointmentDates = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookedAppointmentDates.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBookedAppointmentDates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookedAppointmentDates = action.payload;
      })
      .addCase(fetchBookedAppointmentDates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { createAppointmentDate, deleteAppointmentDate, clearAppointmentDateSlice } =
  bookedAppointmentDateSlice.actions;

export default bookedAppointmentDateSlice.reducer;
