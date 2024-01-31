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
  async ({ userId, userType }, thunkAPI) => {
    try {
      let appointments = [];
      let pendingAppointments = [];
      if (userType === "patient") {
        appointments = await fetchAppointmentsForPatient(userId);
      } else {
        [appointments, pendingAppointments] =
          await fetchAppointmentsForHealthcare(userId);
      }
      // console.log("slice in appointmentSlice" + appointments);

      // Convert non-serializable values to serializable ones and handle null cases

      if (userType === "patient") {
        appointments = appointments.map((appointment) => {
          console.log("current is " + appointment);
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
      }

      if (userType === "healthcare") {
        appointments = appointments.map((appointment) => {
          console.log("current is " + appointment);
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

      // console.log("appointments ", appointments);
      // console.log("pendingAppointments ", pendingAppointments);

      return { appointments, pendingAppointments };
    } catch (error) {
      console.log("error in appointmentSlice", error);
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
        (appointment) => appointment.id !== action.payload.id
      );
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex((appointment) => {
        return appointment.id === action.payload.id;
      });
      const changes = action.payload.changes;
      if (index !== -1) {
        state.appointments[index] = {
          ...state.appointments[index],
          ...changes,
        };
      }
    },
    updatePendingAppointment: (state, action) => {
      const index = state.pendingAppointments.findIndex((appointment) => {
        return appointment.id === action.payload.id;
      });
      if (index !== -1) {
        const currentAppointment = {
          ...state.pendingAppointments[index],
          ...action.payload.changes,
        };
        //Delete from pending and add to appointment
        state.pendingAppointments = state.pendingAppointments.filter(
          (appointment) => appointment.id !== action.payload.id
        );
        state.appointments.push(currentAppointment);
      }
    },
    clearAppointmentSlice: (state) => {
      state.appointments = [];
      state.pendingAppointments = [];
      state.status = "idle";
      state.error = null;
    }
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
export const {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updatePendingAppointment,
  clearAppointmentSlice,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
