export const siteOrigin = "https://leonovde.github.io";

export const locales = {
  en: "English",
  "bn-BD": "বাংলা",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  ne: "नेपाली",
  vi: "Tiếng Việt",
};

export const apps = {
  "ringgit-today": {
    name: "Ringgit Today",
    baseCurrency: "MYR",
    style: "ringgit",
    packageId: "com.leonov_dev.ringgittoday",
    rateSource: "https://www.bnm.gov.my/latest-rates",
    aliases: /\b(?:myr|ringgit|malaysia)\b|\brm(?=\b|\d)|রিঙ্গি[তট]|রিংগি[তট]|रिङ्गिट|रिंगिट/iu,
    descriptions: {
      en: "Track Malaysian ringgit (MYR) exchange rates, convert currencies in both directions, and see your chosen rate in an Android home-screen widget.",
      "bn-BD": "মালয়েশিয়ান রিঙ্গিতের (MYR) বিনিময় হার দেখুন, দুই দিকেই মুদ্রা রূপান্তর করুন এবং অ্যান্ড্রয়েডের হোম স্ক্রিনের উইজেটে পছন্দের হারটি রাখুন।",
      id: "Pantau kurs ringgit Malaysia (MYR), konversi mata uang dua arah, dan lihat kurs pilihan di widget layar utama Android.",
      ms: "Semak kadar pertukaran ringgit Malaysia (MYR), tukar mata wang dalam kedua-dua arah dan lihat kadar pilihan pada widget skrin utama Android.",
      ne: "मलेसियाली रिङ्गिट (MYR) को विनिमय दर हेर्नुहोस्, दुवै दिशामा मुद्रा रूपान्तरण गर्नुहोस् र एन्ड्रोइडको होम स्क्रिन विजेटमा आफूले रोजेको दर राख्नुहोस्।",
      vi: "Theo dõi tỷ giá ringgit Malaysia (MYR), quy đổi tiền tệ hai chiều và xem tỷ giá đã chọn trên tiện ích màn hình chính Android.",
    },
  },
  "sgd-today": {
    name: "SGD Today",
    baseCurrency: "SGD",
    style: "sgd",
    packageId: "com.leonov_dev.sgdtoday",
    rateSource: "https://eservices.mas.gov.sg/Statistics/msb/ExchangeRates.aspx",
    aliases: /\b(?:sgd|singapore|singapura)\b|\bS\$|সিঙ্গাপুর|सिङ्गापुर|सिंगापुर/iu,
    descriptions: {
      en: "Track Singapore dollar (SGD) exchange rates, convert currencies in both directions, and see your chosen rate in an Android home-screen widget.",
      "bn-BD": "সিঙ্গাপুর ডলারের (SGD) বিনিময় হার দেখুন, দুই দিকেই মুদ্রা রূপান্তর করুন এবং অ্যান্ড্রয়েডের হোম স্ক্রিনের উইজেটে পছন্দের হারটি রাখুন।",
      id: "Pantau kurs dolar Singapura (SGD), konversi mata uang dua arah, dan lihat kurs pilihan di widget layar utama Android.",
      ms: "Semak kadar pertukaran dolar Singapura (SGD), tukar mata wang dalam kedua-dua arah dan lihat kadar pilihan pada widget skrin utama Android.",
      ne: "सिङ्गापुर डलर (SGD) को विनिमय दर हेर्नुहोस्, दुवै दिशामा मुद्रा रूपान्तरण गर्नुहोस् र एन्ड्रोइडको होम स्क्रिन विजेटमा आफूले रोजेको दर राख्नुहोस्।",
      vi: "Theo dõi tỷ giá đô la Singapore (SGD), quy đổi tiền tệ hai chiều và xem tỷ giá đã chọn trên tiện ích màn hình chính Android.",
    },
  },
};

export function resolveLocale(value) {
  const language = typeof value === "string" ? value.trim().toLowerCase().split(/[-_]/)[0] : "";
  return Object.keys(locales).find(locale => locale.toLowerCase().split("-")[0] === language);
}

export function appPath(slug, locale = "en") {
  return `/android-apps/${slug}/${locale === "en" ? "" : `${locale.toLowerCase()}/`}`;
}

export function playUrl(app) {
  return `https://play.google.com/store/apps/details?id=${app.packageId}`;
}
