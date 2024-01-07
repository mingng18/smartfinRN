import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCollection } from "../../util/firestoreWR";

const initialState = {
  patients: [],
  status: "idle",
  error: null,
};

export const fetchPatientCollectionData = createAsyncThunk(
  "patients/fetchPatientData",
  async (thunkAPI) => {
    try {
      let patients = await fetchCollection("patient");
        // console.log("fetching patient " + patients[0].date_of_diagnosis.toDate().toISOString())
        patients = patients.map((patient) => {
            const updatedPatient = {
                ...patient,
                date_of_diagnosis: patient.date_of_diagnosis
                    ? patient.date_of_diagnosis.toDate().toISOString()
                    : "",
            };
            return updatedPatient;
        });

      return patients;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const patientDataSlice = createSlice({
  name: "patients",
  initialState: initialState,
  reducers: {
//     createAppointment: (state, action) => {
//       const newAppointment = {
//         ...action.payload,
//       };
//       state.patients.push(newAppointment);
//     },
//     deleteAppointment: (state, action) => {
//       state.patients = state.patients.filter(
//         (appointment) => appointment.id !== action.payload
//       );
//     },
//     updateAppointment: (state, action) => {
//       const index = state.patients.findIndex(
//         (appointment) => appointment.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.patients[index] = {
//           ...state.patients[index],
//           ...action.payload.changes,
//         };
//       }
//     },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatientCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload;
      })
      .addCase(fetchPatientCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators generated for each case reducer function
// export const { createAppointment, deleteAppointment, updateAppointment } =
//   appointmentSlice.actions;

export default patientDataSlice.reducer;
