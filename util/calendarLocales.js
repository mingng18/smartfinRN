import { useTranslation } from "react-i18next";
import { LocaleConfig } from "react-native-calendars";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { LANGUAGE } from "../constants/constants";
import * as SecureStore from "expo-secure-store";

export default function calendarLocales(i18n) {
  // Initialise the locale of React Native Paper Dates library
  registerTranslation("en-GB", enGB);
  registerTranslation("en-MY", enGB);
  registerTranslation("ms-MY", {
    save: "Simpan",
    selectSingle: "Pilih tarikh",
    selectMultiple: "Pilih tarikh-tarikh",
    selectRange: "Pilih tempoh",
    notAccordingToDateFormat: (inputFormat) =>
      `Format tarikh mestilah ${inputFormat}`,
    mustBeHigherThan: (date) => `Mesti selepas ${date}`,
    mustBeLowerThan: (date) => `Mesti sebelum ${date}`,
    mustBeBetween: (startDate, endDate) =>
      `Mesti di antara ${startDate} - ${endDate}`,
    dateIsDisabled: "Hari tidak dibenarkan",
    previous: "Sebelumnya",
    next: "Seterusnya",
    typeInDate: "Taip tarikh",
    pickDateFromCalendar: "Pilih tarikh dari kalendar",
    close: "Tutup",
    hour: "Jam",
    minute: "Minit",
    entertime: "Masukkan masa"
  });
  registerTranslation("id-ID", {
    save: "Simpan",
    selectSingle: "Pilih tanggal",
    selectMultiple: "Pilih tanggal-tanggal",
    selectRange: "Pilih rentang",
    notAccordingToDateFormat: (inputFormat) =>
      `Format tanggal harus ${inputFormat}`,
    mustBeHigherThan: (date) => `Harus setelah ${date}`,
    mustBeLowerThan: (date) => `Harus sebelum ${date}`,
    mustBeBetween: (startDate, endDate) =>
      `Harus di antara ${startDate} - ${endDate}`,
    dateIsDisabled: "Hari tidak diizinkan",
    previous: "Sebelumnya",
    next: "Berikutnya",
    typeInDate: "Ketik tanggal",
    pickDateFromCalendar: "Pilih tanggal dari kalender",
    close: "Tutup",
    hour: "Jam",
    minute: "Menit",
    entertime: "Masukkan waktu"
  });

  //Initialise locale of React Native Calendars
  LocaleConfig.locales.en = LocaleConfig.locales[""];
  LocaleConfig.locales["ms-MY"] = {
    monthNames: [
      "Januari",
      "Februari",
      "Mac",
      "April",
      "Mei",
      "Jun",
      "Julai",
      "Ogos",
      "September",
      "Oktober",
      "November",
      "Disember",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mac",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ogos",
      "Sep",
      "Okt",
      "Nov",
      "Dis",
    ],
    dayNames: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
    dayNamesShort: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
    today: "Hari ini",
  };
  LocaleConfig.locales["id-ID"] = {
    monthNames: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    today: "Hari ini",
  };

  changeCalendarsLocales(i18n);
  changePaperLocales(i18n);
}

export function changeCalendarsLocales(language) {
  if (language === LANGUAGE.ENGLISH) {
    LocaleConfig.defaultLocale = "en";
  } else if (language === LANGUAGE.BAHASA_MELAYU) {
    LocaleConfig.defaultLocale = "ms-MY";
  } else if (language === LANGUAGE.BAHASA_INDONESIA) {
    LocaleConfig.defaultLocale = "id-ID";
  }
}

export async function changePaperLocales(language) {
  console.log(typeof(language));
  await SecureStore.setItemAsync("locale", language.toString());
}
