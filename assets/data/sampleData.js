// Dummy data
const videos = [
  {
    medical_checklist: "pending",
    rejected_reason: "pending",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
    reviewer_id: "pending",
    status: "pending",
    submitter_id: "pending",
    uploaded_timestamp: Timestamp.fromDate(new Date("2023-12-20")),
    video_url: "pending",
  },
];

const appointments = [
  {
    appointment_status: "pending",
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "asiudbahfsas",
    remarks: "test",
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
  },
  {
    appointment_status: "completed",
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "asiudbahfsas",
    remarks: "test",
    scheduled_timestamp: Timestamp.fromDate(new Date("2023-12-23")),
  },
];

const sideEffectData = [
  {
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "X2U3YtMP1GQ9wo377rBpj8nrGPu2",
    remarks: "lol",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    se_status: "pending",
    severity: "danger",
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    symptoms: ["cough", "blood"],
  },
  {
    created_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    healthcare_id: "dsdujdfjdnsf",
    patient_id: "X2U3YtMP1GQ9wo377rBpj8nrGPu2",
    reviewed_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    remarks: "Drink more water",
    se_status: "reviewed",
    severity: "mild",
    side_effect_occuring_timestamp: Timestamp.fromDate(new Date("2023-12-21")),
    symptoms: ["cough", "nausea"],
  },
];


const [toDoDetails, setToDoDetails] = React.useState([
    {
      title: "You haven’t take\nmedication yet today",
      icon: "medical-bag",
      count: 0,
      onPressedCallback: () => bottomSheetModalRef.current?.present(),
    },
    {
      title: "Appointment",
      icon: "calendar",
      count: pendingAppointmentsCount,
      onPressedCallback: () => navigate("AllAppointmentScreen"),
    },
    {
      title: "Video Call Missed",
      icon: "video",
      count: 1,
    },
    {
      title: "Video Rejected",
      icon: "play",
      count: rejectedVideo(videos),
    },
  ]);