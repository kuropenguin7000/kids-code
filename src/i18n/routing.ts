import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  // Keep URLs clean (no /en or /id prefix); the locale lives in a cookie.
  localePrefix: "never",
  localeCookie: {
    // Remember the chosen language for a year
    maxAge: 60 * 60 * 24 * 365,
  },
});
