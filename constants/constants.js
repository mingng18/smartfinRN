export const BLANK_PROFILE_PIC = require("../assets/blank-profile-pic.png");
export const LOGO_NO_TYPE = require("../assets/logo-no-type.png");
export const LOGO_WHITE_TYPE = require("../assets/logo-white-type.png");
export const LOGO_BLACK_TYPE = require("../assets/logo-black-type.png");

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
  ENGLISH: "en-MY",
  BAHASA_MELAYU: "ms-MY",
  BAHASA_INDONESIA: "id-ID",
};

export const NATIONALITY = [
  { label: "Andorra", value: "Andorra" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "Afghanistan", value: "Afghanistan" },
  { label: "Anguilla", value: "Anguilla" },
  { label: "Albania", value: "Albania" },
  { label: "Armenia", value: "Armenia" },
  { label: "Angola", value: "Angola" },
  { label: "Antarctica", value: "Antarctica" },
  { label: "Argentina", value: "Argentina" },
  { label: "American Samoa", value: "American Samoa" },
  { label: "Austria", value: "Austria" },
  { label: "Australia", value: "Australia" },
  { label: "Aruba", value: "Aruba" },
  { label: "Åland Islands", value: "Åland Islands" },
  { label: "Azerbaijan", value: "Azerbaijan" },
  { label: "Barbados", value: "Barbados" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Belgium", value: "Belgium" },
  { label: "Burkina Faso", value: "Burkina Faso" },
  { label: "Bulgaria", value: "Bulgaria" },
  { label: "Bahrain", value: "Bahrain" },
  { label: "Burundi", value: "Burundi" },
  { label: "Benin", value: "Benin" },
  { label: "Bermuda", value: "Bermuda" },
  { label: "Brazil", value: "Brazil" },
  { label: "Bahamas", value: "Bahamas" },
  { label: "Bhutan", value: "Bhutan" },
  { label: "Bouvet Island", value: "Bouvet Island" },
  { label: "Botswana", value: "Botswana" },
  { label: "Belarus", value: "Belarus" },
  { label: "Belize", value: "Belize" },
  { label: "Canada", value: "Canada" },
  { label: "Cocos (Keeling) Islands", value: "Cocos (Keeling) Islands" },
  { label: "Central African Republic", value: "Central African Republic" },
  { label: "Switzerland", value: "Switzerland" },
  { label: "Cook Islands", value: "Cook Islands" },
  { label: "Chile", value: "Chile" },
  { label: "Cameroon", value: "Cameroon" },
  { label: "China", value: "China" },
  { label: "Colombia", value: "Colombia" },
  { label: "Costa Rica", value: "Costa Rica" },
  { label: "Cuba", value: "Cuba" },
  { label: "Cape Verde", value: "Cape Verde" },
  { label: "Christmas Island", value: "Christmas Island" },
  { label: "Cyprus", value: "Cyprus" },
  { label: "Germany", value: "Germany" },
  { label: "Djibouti", value: "Djibouti" },
  { label: "Denmark", value: "Denmark" },
  { label: "Dominica", value: "Dominica" },
  { label: "Dominican Republic", value: "Dominican Republic" },
  { label: "Algeria", value: "Algeria" },
  { label: "Ecuador", value: "Ecuador" },
  { label: "Estonia", value: "Estonia" },
  { label: "Egypt", value: "Egypt" },
  { label: "Eritrea", value: "Eritrea" },
  { label: "Spain", value: "Spain" },
  { label: "Ethiopia", value: "Ethiopia" },
  { label: "Finland", value: "Finland" },
  { label: "Fiji", value: "Fiji" },
  { label: "Faroe Islands", value: "Faroe Islands" },
  { label: "France", value: "France" },
  { label: "Gabon", value: "Gabon" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Grenada", value: "Grenada" },
  { label: "Georgia", value: "Georgia" },
  { label: "French Guiana", value: "French Guiana" },
  { label: "Guernsey", value: "Guernsey" },
  { label: "Ghana", value: "Ghana" },
  { label: "Gibraltar", value: "Gibraltar" },
  { label: "Greenland", value: "Greenland" },
  { label: "Gambia", value: "Gambia" },
  { label: "Guinea", value: "Guinea" },
  { label: "Guadeloupe", value: "Guadeloupe" },
  { label: "Equatorial Guinea", value: "Equatorial Guinea" },
  { label: "Greece", value: "Greece" },
  { label: "Guatemala", value: "Guatemala" },
  { label: "Guam", value: "Guam" },
  { label: "Guinea-Bissau", value: "Guinea-Bissau" },
  { label: "Guyana", value: "Guyana" },
  { label: "Honduras", value: "Honduras" },
  { label: "Croatia", value: "Croatia" },
  { label: "Haiti", value: "Haiti" },
  { label: "Hungary", value: "Hungary" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Ireland", value: "Ireland" },
  { label: "Israel", value: "Israel" },
  { label: "Isle of Man", value: "Isle of Man" },
  { label: "India", value: "India" },
  { label: "British Indian Ocean Territory", value: "British Indian Ocean Territory" },
  { label: "Iraq", value: "Iraq" },
  { label: "Iceland", value: "Iceland" },
  { label: "Italy", value: "Italy" },
  { label: "Jersey", value: "Jersey" },
  { label: "Jamaica", value: "Jamaica" },
  { label: "Jordan", value: "Jordan" },
  { label: "Japan", value: "Japan" },
  { label: "Kenya", value: "Kenya" },
  { label: "Kyrgyzstan", value: "Kyrgyzstan" },
  { label: "Cambodia", value: "Cambodia" },
  { label: "Kiribati", value: "Kiribati" },
  { label: "Comoros", value: "Comoros" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Cayman Islands", value: "Cayman Islands" },
  { label: "Kazakhstan", value: "Kazakhstan" },
  { label: "Laos", value: "Laos" },
  { label: "Lebanon", value: "Lebanon" },
  { label: "Liechtenstein", value: "Liechtenstein" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Liberia", value: "Liberia" },
  { label: "Lesotho", value: "Lesotho" },
  { label: "Lithuania", value: "Lithuania" },
  { label: "Luxembourg", value: "Luxembourg" },
  { label: "Latvia", value: "Latvia" },
  { label: "Morocco", value: "Morocco" },
  { label: "Monaco", value: "Monaco" },
  { label: "Moldova", value: "Moldova" },
  { label: "Montenegro", value: "Montenegro" },
  { label: "Madagascar", value: "Madagascar" },
  { label: "Marshall Islands", value: "Marshall Islands" },
  { label: "Mali", value: "Mali" },
  { label: "Mongolia", value: "Mongolia" },
  { label: "Northern Mariana Islands", value: "Northern Mariana Islands" },
  { label: "Martinique", value: "Martinique" },
  { label: "Mauritania", value: "Mauritania" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Malta", value: "Malta" },
  { label: "Mauritius", value: "Mauritius" },
  { label: "Maldives", value: "Maldives" },
  { label: "Malawi", value: "Malawi" },
  { label: "Mexico", value: "Mexico" },
  { label: "Malaysia", value: "Malaysia" },
  { label: "Mozambique", value: "Mozambique" },
  { label: "Namibia", value: "Namibia" },
  { label: "New Caledonia", value: "New Caledonia" },
  { label: "Niger", value: "Niger" },
  { label: "Norfolk Island", value: "Norfolk Island" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Nicaragua", value: "Nicaragua" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "Norway", value: "Norway" },
  { label: "Nepal", value: "Nepal" },
  { label: "Nauru", value: "Nauru" },
  { label: "Niue", value: "Niue" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Oman", value: "Oman" },
  { label: "Panama", value: "Panama" },
  { label: "Peru", value: "Peru" },
  { label: "French Polynesia", value: "French Polynesia" },
  { label: "Papua New Guinea", value: "Papua New Guinea" },
  { label: "Philippines", value: "Philippines" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Poland", value: "Poland" },
  { label: "Puerto Rico", value: "Puerto Rico" },
  { label: "Portugal", value: "Portugal" },
  { label: "Palau", value: "Palau" },
  { label: "Paraguay", value: "Paraguay" },
  { label: "Qatar", value: "Qatar" },
  { label: "Romania", value: "Romania" },
  { label: "Serbia", value: "Serbia" },
  { label: "Russia", value: "Russia" },
  { label: "Rwanda", value: "Rwanda" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Solomon Islands", value: "Solomon Islands" },
  { label: "Seychelles", value: "Seychelles" },
  { label: "Sudan", value: "Sudan" },
  { label: "Sweden", value: "Sweden" },
  { label: "Singapore", value: "Singapore" },
  { label: "Slovenia", value: "Slovenia" },
  { label: "Slovakia", value: "Slovakia" },
  { label: "Sierra Leone", value: "Sierra Leone" },
  { label: "San Marino", value: "San Marino" },
  { label: "Senegal", value: "Senegal" },
  { label: "Somalia", value: "Somalia" },
  { label: "Suriname", value: "Suriname" },
  { label: "South Sudan", value: "South Sudan" },
  { label: "El Salvador", value: "El Salvador" },
  { label: "Chad", value: "Chad" },
  { label: "French Southern Territories", value: "French Southern Territories" },
  { label: "Togo", value: "Togo" },
  { label: "Thailand", value: "Thailand" },
  { label: "Tajikistan", value: "Tajikistan" },
  { label: "Tokelau", value: "Tokelau" },
  { label: "Timor-Leste", value: "Timor-Leste" },
  { label: "Turkmenistan", value: "Turkmenistan" },
  { label: "Tunisia", value: "Tunisia" },
  { label: "Tonga", value: "Tonga" },
  { label: "Turkey", value: "Turkey" },
  { label: "Tuvalu", value: "Tuvalu" },
  { label: "Taiwan", value: "Taiwan" },
  { label: "Ukraine", value: "Ukraine" },
  { label: "Uganda", value: "Uganda" },
  { label: "United States", value: "United States" },
  { label: "Uruguay", value: "Uruguay" },
  { label: "Uzbekistan", value: "Uzbekistan" },
  { label: "Vietnam", value: "Vietnam" },
  { label: "Vanuatu", value: "Vanuatu" },
  { label: "Samoa", value: "Samoa" },
  { label: "Kosovo", value: "Kosovo" },
  { label: "Yemen", value: "Yemen" },
  { label: "Mayotte", value: "Mayotte" },
  { label: "South Africa", value: "South Africa" },
  { label: "Zambia", value: "Zambia" },
  { label: "Zimbabwe", value: "Zimbabwe" },
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

export const NUMBER_OF_TABLETS = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

export const NOTES = [
  { label: "Continue VOTS", value: "Continue VOTS" },
  { label: "Switch to DOTS", value: "Switch to DOTS" },
];

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
