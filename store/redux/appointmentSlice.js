import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAppointmentsForHealthcare,
  fetchAppointmentsForPatient,
} from "../../util/firestoreWR";

const initialState = {
  appointments: [],
  pendingAppointments: [],
  status: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async ({ patientId, userType }, thunkAPI) => {
    try {
      let appointments = [];
      let pendingAppointments = [];
      if (userType === "patient") {
        appointments = await fetchAppointmentsForPatient(patientId);
      } else {
        [appointments, pendingAppointments] =
          await fetchAppointmentsForHealthcare(patientId);
      }

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
          patient_data: {
            ...appointment.patient_data,
            date_of_diagnosis: appointment.patient_data.date_of_diagnosis
              ? appointment.patient_data.date_of_diagnosis
                  .toDate()
                  .toISOString()
              : "",
          },
        };
        return updatedAppointment;
      });

      if (userType !== "patient") {
        pendingAppointments = pendingAppointments.map((appointment) => {
          const updatedAppointment = {
            ...appointment,
            created_timestamp: appointment.created_timestamp
              ? appointment.created_timestamp.toDate().toISOString()
              : "",
            scheduled_timestamp: appointment.scheduled_timestamp
              ? appointment.scheduled_timestamp.toDate().toISOString()
              : "",
            patient_data: {
              ...appointment.patient_data,
              date_of_diagnosis: appointment.patient_data.date_of_diagnosis
                ? appointment.patient_data.date_of_diagnosis
                    .toDate()
                    .toISOString()
                : "",
            },
          };
          return updatedAppointment;
        });
      }

      console.log("appointments ", appointments);
      console.log("pendingAppointments ", pendingAppointments);

      return { appointments, pendingAppointments };
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
        state.appointments = action.payload.appointments;
        state.pendingAppointments = action.payload.pendingAppointments;
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
