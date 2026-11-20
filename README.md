# LDE Dev

Static homepage, Android app catalogue and app pages for Ringgit Today and SGD Today.

## Publish on GitHub Pages

1. Commit the contents of this archive at the root of the public `leonovde.github.io` repository. Include `.nojekyll`.
2. In Settings → Pages, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. When the deployment succeeds, open https://leonovde.github.io/ and https://leonovde.github.io/sitemap.xml.

The canonical URLs, social metadata, structured data, sitemap, and robots file use https://leonovde.github.io. If the site moves to another origin, update those references together.

## Google Play links after public launch

| App | Website field | Privacy Policy field |
|---|---|---|
| Ringgit Today | https://leonovde.github.io/android-apps/ringgit-today/ | https://leonovde.github.io/android-apps/ringgit-today/privacy-policy/ |
| SGD Today | https://leonovde.github.io/android-apps/sgd-today/ | https://leonovde.github.io/android-apps/sgd-today/privacy-policy/ |

Open both policy URLs in a signed-out browser before changing the Play Console fields.

The catalogue is at https://leonovde.github.io/android-apps/. Former app URLs under `/apps/` forward to their new locations.

## Localized app pages and WebMCP

The English app pages are the default. Bengali, Indonesian, Malay, Nepali and Vietnamese have static URLs under each app page. Edit the app metadata and summaries in `assets/currency-app-catalog.mjs` and localized page copy in `scripts/app-translations.mjs`, then run `node scripts/build-localized-pages.mjs` and commit the generated pages, language links and sitemap.

For a local preview, run `python3 -m http.server 8000` from the repository root. A browser that exposes `document.modelContext` registers the read-only `find_currency_app` tool on the homepage, catalogue and app pages. Test with a WebMCP-enabled Chromium build on localhost. The tool takes optional currency codes, a preferred tracker base, a query and a reply language. The app pages, links and language switcher work without WebMCP.

Run `node --test scripts/currency-app-tool.test.mjs` to check routing and localization.
