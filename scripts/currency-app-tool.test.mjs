import assert from "node:assert/strict";
import test from "node:test";
import { locales } from "../assets/currency-app-catalog.mjs";
import { createCurrencyAppTool } from "../assets/currency-app-tool.mjs";

const tool = createCurrencyAppTool("en");
const ids = result => result.apps.map(app => app.id);

test("routes free-text app searches in all six locales", () => {
  const cases = [
    ["en", "I need an Android tracker for RM100", "ringgit-today"],
    ["bn", "সিঙ্গাপুর ডলারের রেট দেখার অ্যাপ চাই", "sgd-today"],
    ["id-ID", "Aplikasi Android untuk cek kurs rupiah ke ringgit", "ringgit-today"],
    ["ms-MY", "Aplikasi semak kadar dolar Singapura", "sgd-today"],
    ["ne-NP", "मलेसियाली रिङ्गिटको दर हेर्ने एप", "ringgit-today"],
    ["vi-VN", "Ứng dụng xem tỷ giá đô la Singapore", "sgd-today"],
  ];
  for (const [language, query, id] of cases) {
    const result = tool.execute({ language, query });
    assert.deepEqual(ids(result), [id]);
    assert.ok(Object.hasOwn(locales, result.language));
    const [app] = result.apps;
    assert.equal(new URL(app.websiteUrl).pathname.split("/")[2], id);
    assert.equal(app.googlePlayUrl, `https://play.google.com/store/apps/details?id=com.leonov_dev.${id.replace("-", "")}`);
    assert.deepEqual(app.appInterfaceLanguages, Object.keys(locales));
  }
});

test("keeps language independent from the requested currency and honors the page locale", () => {
  const result = createCurrencyAppTool("bn-BD").execute({ currencies: ["sgd"] });
  assert.equal(result.language, "bn-BD");
  assert.equal(result.apps[0].baseCurrency, "SGD");
  assert.match(result.apps[0].description, /সিঙ্গাপুর/);
  assert.ok(result.apps[0].websiteUrl.endsWith("/bn-bd/"));
  assert.equal(tool.execute({ language: "fr" }).language, "en");
});

test("returns both for an ambiguous pair and follows explicit app or tracker base preferences", () => {
  const currencies = ["MYR", "SGD"];
  assert.deepEqual(ids(tool.execute({ currencies })), ["ringgit-today", "sgd-today"]);
  assert.deepEqual(ids(tool.execute({ currencies, baseCurrency: "sgd" })), ["sgd-today"]);
  assert.deepEqual(ids(tool.execute({ currencies, query: "Is Ringgit Today suitable for SGD?" })), ["ringgit-today"]);
  assert.deepEqual(ids(tool.execute({ currencies, baseCurrency: "USD" })), []);
});

test("lists both with no filter and gives no match for an unrelated pair", () => {
  assert.deepEqual(ids(tool.execute()), ["ringgit-today", "sgd-today"]);
  assert.deepEqual(ids(tool.execute({ currencies: ["USD", "JPY"], query: "Convert US$ to Japanese yen" })), []);
});

test("the browser entry registers a read-only tool when WebMCP is available", async () => {
  const originalDocument = globalThis.document;
  try {
    globalThis.document = {};
    await import("../assets/webmcp.mjs?unsupported");

    let registeredTool;
    globalThis.document = {
      documentElement: { lang: "vi" },
      modelContext: { registerTool(tool) { registeredTool = tool; } },
    };
    await import("../assets/webmcp.mjs?supported");
    assert.equal(registeredTool.name, "find_currency_app");
    assert.equal(registeredTool.annotations.readOnlyHint, true);
    assert.equal(registeredTool.execute({ currencies: ["MYR"] }).language, "vi");
  } finally {
    globalThis.document = originalDocument;
  }
});
