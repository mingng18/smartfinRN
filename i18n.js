import i18n from "i18next";
import * as Localization from "expo-localization";
import { initReactI18next } from "react-i18next";

import auth_en from "./locales/en/auth_en.json";
// import common_en from "./locales/en/common_en.json";
// import patient_en from "./locales/en/patient_en.json";
// import healthcare_en from "./locales/en/healthcare_en.json";

import auth_ms from "./locales/ms/auth_ms.json";
// import common_ms from "./locales/ms/common_ms.json";
// import patient_ms from "./locales/ms/patient_ms.json";
// import healthcare_ms from "./locales/ms/healthcare_ms.json";

import auth_id from "./locales/id/auth_id.json";
// import common_id from "./locales/id/common_id.json";
// import patient_id from "./locales/id/patient_id.json";
// import healthcare_id from "./locales/id/healthcare_id.json";

const languageDetector = {
  type: "languageDetector",
  async: true, // async detection
  detect: (callback) => {
    // We will get back a string like "en-UK".
    callback(Localization.locale);
    console.log(Localization.locale);
  },

  init: () => {},

  cacheUserLanguage: () => {},
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    fallbackLng: "en-MY",
    compatibilityJSON: "v3",
    resources: {
      "en-MY": {
        auth: auth_en,
        // common: common_en,
        // patient: patient_en,
        // healthcare: healthcare_en,
      },
      "ms-MY": {
        auth: auth_ms,
        // common: common_ms,
        // patient: patient_ms,
        // healthcare: healthcare_ms,
      },
      "id-ID": {
        auth: auth_id,
        // common: common_id,
        // patient: patient_id,
        // healthcare: healthcare_id,
      },
    },
    supportedLngs: ["en-MY", "ms-MY", "id-ID"],
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
