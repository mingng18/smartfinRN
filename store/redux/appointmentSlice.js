import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAppointmentsForPatient } from "../../util/firestoreWR";

const initialState = {
  appointments: [],
  status: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (patientId, thunkAPI) => {
    try {
      let appointments = await fetchAppointmentsForPatient(patientId);

      // Convert non-serializable values to serializable ones and handle null cases
      appointments = appointments.map((appointment) => {
        const updatedAppointment = {
          ...appointment,
          created_timestamp: appointment.created_timestamp
            ? appointment.created_timestamp.toDate().toISOString()
            : "",
          scheduled_timestamp: appointment.scheduled_timestamp
            ? appointment.scheduled_timestamp.toDate().toISOString()
            : "",
        };
        return updatedAppointment;
      });

      return appointments;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState: initialState,
  reducers: {
    createAppointment: (state, action) => {
      const newAppointment = {
        ...action.payload,
      };
      state.appointments.push(newAppointment);
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment.id !== action.payload
      );
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = {
          ...state.appointments[index],
          ...action.payload.changes,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators generated for each case reducer function
export const { createAppointment, deleteAppointment, updateAppointment } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
