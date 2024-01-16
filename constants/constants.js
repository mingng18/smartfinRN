export const BLANK_PROFILE_PIC = require("../assets/blank-profile-pic.png");
export const LOGO_NO_TYPE = require("../assets/logo-no-type.png");

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const SIDE_EFFECT_SEVERITY = {
  GRADE_1: "grade1",
  GRADE_2: "grade2",
  GRADE_3: "grade3",
};

export const VIDEO_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const SIDE_EFFECT_STATUS = {
  PENDING: "pending",
  REVIEWED: "reviewed",
};

export const LANGUAGE = {
  ENGLISH: "english",
  BAHASA_MELAYU: "bahasa-melayu",
  BAHASA_INDONESIA: "bahasa-indonesia",
};

export const GENDER = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const NATIONALITY = [
  { label: "Malaysian", value: "Malaysian" },
  { label: "Indonesian", value: "Indonesian" },
];

export const TREATMENT = [
  { label: "Akurit-4 (EHRZ Fixed dose combination)", value: "akurit4" },
  { label: "Akurit (HR Fixed dose combination)", value: "akurit" },
  { label: "Pyridoxine 10mg", value: "pyridoxine" },
];

export const DIAGNOSIS = [
  { label: "Smear positive pulmonary tuberculosis (SPPTB)", value: "SPPTB" },
  { label: "Smear negative pulmonary tuberculosis (SNPTB)", value: "SNPTB" },
  { label: "Extrapulmonary tuberculosis (EXPTB)", value: "EXPTB" },
  { label: "Latent TB infection (LTBI)", value: "LTBI" },
];
export const NOTES = { VOTS: "Continue VOTS", DOTS: "Switch to DOTS" };

export const SIDE_EFFECT_GRADE = [
  { label: "Grade 1", value: 1 },
  { label: "Grade 2", value: 2 },
  { label: "Grade 3", value: 3 },
];

export const HORIZONTAL_CARD_TYPE = {
  DEFAULT: "default",
  NO_PIC: "no-pic",
  VIDEO_CALL_APPOINTMENT: "video-call-appointment",
  PATIENT: "patient",
};

export const COMPLIANCE_STATUS = {
  GOOD: "good",
  MODERATE: "moderate",
  SEVERE: "severe",
};

export const FIREBASE_COLLECTION = {
  APPOINTMENT: "appointment",
  HEALTHCARE: "healthcare",
  PATIENT: "patient",
  SIDE_EFFECT: "side_effect",
  VIDEO: "video",
};

export const USER_TYPE = {
  PATIENT: "patient",
  HEALTHCARE: "healthcare",
};

export const CALENDAR_ENTITIES = {
  VIDEO: "video",
  APPOINTMENT: "appointment",
  SIDE_EFFECT: "side-effect",
};

export const APPOINTMENT_TIME = [
  { label: "2:00 pm", value: { hour: 2, minute: 0 } , disabled: false},
  { label: "2:30 pm", value: { hour: 2, minute: 30 } , disabled: false },
  { label: "3:00 pm", value: { hour: 3, minute: 0 } , disabled: false},
  { label: "3:30 pm", value: { hour: 3, minute: 30 } , disabled: false },
  { label: "4:00 pm", value: { hour: 4, minute: 0 } , disabled: false},
  { label: "4:30 pm", value: { hour: 4, minute: 30 } , disabled: false },
];