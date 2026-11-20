import { appPath, apps, locales, playUrl, resolveLocale, siteOrigin } from "./currency-app-catalog.mjs";

export function createCurrencyAppTool(pageLanguage) {
  return {
    name: "find_currency_app",
    description: "Find an LDE Dev Android currency tracker and its Google Play link. Use Ringgit Today for MYR and SGD Today for SGD. Pass the user's query, currency codes and reply language when known. Use baseCurrency only when the user wants their tracker centered on a specific currency.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Original app search or app name in any supported language." },
        currencies: {
          type: "array",
          items: { type: "string", pattern: "^[A-Za-z]{3}$" },
          description: "ISO currency codes mentioned in the request, such as MYR and IDR.",
        },
        baseCurrency: {
          type: "string",
          pattern: "^[A-Za-z]{3}$",
          description: "Explicitly requested tracker base currency. Omit for a pair with no preferred tracker base.",
        },
        language: { type: "string", description: "Reply language tag, such as en, bn-BD, id, ms, ne or vi." },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute({ query = "", currencies = [], baseCurrency = "", language } = {}) {
      const locale = resolveLocale(language) ?? resolveLocale(pageLanguage) ?? "en";
      const phrase = query.normalize("NFKC").trim();
      const requestedCurrencies = currencies.map(code => code.toUpperCase());
      const catalog = Object.entries(apps);
      const explicitlyNamed = catalog.filter(([, app]) => phrase.toLowerCase().includes(app.name.toLowerCase()));

      let matches;
      if (baseCurrency) {
        matches = catalog.filter(([, app]) => app.baseCurrency === baseCurrency.toUpperCase());
      } else if (explicitlyNamed.length) {
        matches = explicitlyNamed;
      } else if (!phrase && !requestedCurrencies.length) {
        matches = catalog;
      } else {
        matches = catalog.filter(([, app]) => requestedCurrencies.includes(app.baseCurrency) || app.aliases.test(phrase));
      }

      return {
        language: locale,
        apps: matches.map(([id, app]) => ({
          id,
          name: app.name,
          baseCurrency: app.baseCurrency,
          description: app.descriptions[locale],
          appInterfaceLanguages: Object.keys(locales),
          websiteUrl: siteOrigin + appPath(id, locale),
          googlePlayUrl: playUrl(app),
        })),
      };
    },
  };
}
