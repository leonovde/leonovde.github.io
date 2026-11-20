import { mkdir, readFile, writeFile } from "node:fs/promises";
import { appPath, apps, locales, playUrl, siteOrigin } from "../assets/currency-app-catalog.mjs";
import { translations } from "./app-translations.mjs";

const languageTags = Object.keys(locales);
const translatedTags = languageTags.filter(tag => tag !== "en");

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function alternates(slug) {
  return [...languageTags, "x-default"].map(tag => {
    const url = siteOrigin + appPath(slug, tag === "x-default" ? "en" : tag);
    return `  <link rel="alternate" hreflang="${tag}" href="${url}">`;
  }).join("\n");
}

function languageNav(slug, locale, label) {
  const links = languageTags.map(tag => {
    const current = tag === locale ? ' aria-current="page"' : "";
    return `        <li><a href="${appPath(slug, tag)}" lang="${tag}" hreflang="${tag}"${current}>${locales[tag]}</a></li>`;
  });
  return `    <nav class="app-languages" aria-label="${escapeHtml(label)}">
      <ul>
${links.join("\n")}
      </ul>
    </nav>`;
}

function renderLocalizedPage(slug, app, locale) {
  const copy = translations[locale];
  const page = copy[slug];
  const title = escapeHtml(page.title);
  const description = app.descriptions[locale];
  const encodedDescription = escapeHtml(description);
  const canonical = siteOrigin + appPath(slug, locale);
  const store = playUrl(app);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description,
    url: canonical,
    image: `${siteOrigin}/assets/${slug}.webp`,
    inLanguage: locale,
    operatingSystem: "Android",
    applicationCategory: "FinanceApplication",
    installUrl: store,
    publisher: { "@type": "Organization", "@id": `${siteOrigin}/#publisher`, name: "LDE Dev", url: `${siteOrigin}/` },
  };
  const features = copy.featureLabels.map(label => escapeHtml(label.replace("{currency}", app.baseCurrency)));
  const details = page.details.map(paragraph => `      <p>${escapeHtml(paragraph)}</p>`);
  const questions = page.faq.map(([question, answer]) => `      <div class="question">
        <h3>${escapeHtml(question)}</h3>
        <p>${escapeHtml(answer)}</p>
      </div>`);
  const youtube = slug === "ringgit-today"
    ? '\n          <a class="button" href="https://www.youtube.com/@ldedevapps">LDE Dev · YouTube <span class="arrow" aria-hidden="true"></span></a>'
    : "";

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${encodedDescription}">
  <link rel="canonical" href="${canonical}">
${alternates(slug)}
  <meta name="theme-color" content="#f6f8fc">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="LDE Dev">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${encodedDescription}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/assets/${slug}-share.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${app.name}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>
  <script type="module" src="/assets/webmcp.mjs"></script>
</head>
<body>
  <a class="skip-link" href="#main">${escapeHtml(copy.skip)}</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">LD</span>LDE Dev</a>
      <nav class="header-nav" aria-label="${escapeHtml(copy.navigation)}"><a href="/android-apps/" hreflang="en">${escapeHtml(copy.apps)}</a></nav>
    </div>
  </header>
  <main class="shell detail-${app.style}" id="main">
    <a class="back" href="/android-apps/" hreflang="en"><span class="arrow" aria-hidden="true"></span> ${escapeHtml(copy.allApps)}</a>
${languageNav(slug, locale, copy.languages)}
    <section class="hero detail-hero" aria-labelledby="app-title">
      <div>
        <h1 id="app-title">${app.name}</h1>
        <div class="actions">
          <a class="button button-primary" href="${store}">${escapeHtml(copy.install)} <span class="arrow" aria-hidden="true"></span></a>${youtube}
        </div>
        <div class="section-jumps">
          <a href="#exchange-rate-questions">${escapeHtml(copy.questions)}</a>
          <a id="privacy-policy" href="${appPath(slug)}privacy-policy/" hreflang="en">${escapeHtml(copy.privacy)} (${escapeHtml(copy.english)})</a>
        </div>
      </div>
      <div class="art" aria-hidden="true"><img class="app-icon" src="/assets/${slug}.webp" width="192" height="192" alt="" decoding="async"></div>
    </section>
    <section class="feature-section" aria-labelledby="features-title">
      <h2 class="section-title" id="features-title">${escapeHtml(copy.features)}</h2>
      <ul class="feature-list">${features.map(text => `<li>${text}</li>`).join("")}</ul>
    </section>
    <section class="about-section" aria-labelledby="about-title">
      <h2 class="section-title" id="about-title">${escapeHtml(copy.about.replace("{app}", app.name))}</h2>
      <p><strong>${encodedDescription}</strong></p>
${details.join("\n")}
    </section>
    <section class="questions-section" aria-labelledby="exchange-rate-questions">
      <h2 class="section-title" id="exchange-rate-questions" tabindex="-1">${escapeHtml(copy.questions)}</h2>
${questions.join("\n")}
      <p class="rate-reference"><a href="${app.rateSource}">${escapeHtml(page.reference)}</a></p>
    </section>
  </main>
  <footer class="site-footer">
    <div class="shell footer-inner">LDE Dev</div>
  </footer>
</body>
</html>
`;
}

async function replaceGeneratedBlock(file, name, content) {
  const url = new URL(file, import.meta.url);
  const html = await readFile(url, "utf8");
  const start = `<!-- ${name}:start -->\n`;
  const end = `\n<!-- ${name}:end -->`;
  const before = html.indexOf(start);
  const after = html.indexOf(end, before + start.length);
  if (before < 0 || after < 0) throw new Error(`Missing ${name} markers in ${file}`);
  await writeFile(url, html.slice(0, before + start.length) + content + html.slice(after));
}

const sitemapEntries = [];
for (const [slug, app] of Object.entries(apps)) {
  const englishFile = `..${appPath(slug)}index.html`;
  await replaceGeneratedBlock(englishFile, "app-alternates", alternates(slug));
  await replaceGeneratedBlock(englishFile, "app-languages", languageNav(slug, "en", "Language"));
  for (const locale of translatedTags) {
    const path = appPath(slug, locale);
    const directory = new URL(`..${path}`, import.meta.url);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), renderLocalizedPage(slug, app, locale));
    sitemapEntries.push(`  <url><loc>${siteOrigin}${path}</loc></url>`);
  }
}
await replaceGeneratedBlock("../sitemap.xml", "localized-apps", sitemapEntries.join("\n"));
