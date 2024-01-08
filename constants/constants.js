export const BLANK_PROFILE_PIC = require("../assets/blank-profile-pic.png");

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const SIDE_EFFECT_SEVERITY = {
  SEVERE: "severe",
  MODERATE: "moderate",
  MILD: "mild",
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
  BAHASA_INDONESIA: "bahasa-indo",
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
  VIDEO_CALL_APPOINTMENT: "video-call-appointment",
  PATIENT: "patient",
};

export const COMPLIANCE_STATUS = {
  GOOD: "good",
  MODERATE: "moderate",
  SEVERE: "severe",
};
