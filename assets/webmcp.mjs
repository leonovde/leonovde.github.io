// Load the catalog only on browsers that expose WebMCP.
if (typeof document.modelContext?.registerTool === "function") {
  const { createCurrencyAppTool } = await import("./currency-app-tool.mjs");
  await document.modelContext.registerTool(createCurrencyAppTool(document.documentElement.lang));
}
