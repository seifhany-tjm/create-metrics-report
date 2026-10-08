# Bundled TJM Labs branding

Use these bundled assets automatically. Team members do not need access to a shared Drive or to supply branding again.

- `assets/brand/tjm-logo.png`: original light-background cross/circuit wordmark, also embedded in `assets/daily_report.gs`.
- `assets/brand/brand-guidelines.pdf`: April 2025 brand guide; palette on pages 10–11.

| Use | Color |
|---|---|
| Primary purple | `#5C288F` |
| Lavender | `#E9DFFC` |
| Warm beige | `#D9D4CC` |
| Charcoal | `#2E2E2E` |
| Light gray | `#F4F4F5` |

Use Inter for body/data with Arial/Helvetica fallbacks; DM Serif Display for the heading with Georgia fallback. The report must look good without remote font loading.

Use a white canvas, purple lead metric, lavender companion metric, quiet gray supporting cards, charcoal text, and beige dividers. The first two selected KPIs are featured. Adjust cards and wrapping to the user's metrics instead of imposing a fixed count. Keep the exact reporting period visible and use the agreed report title/customer name; no pharmacy name is built into the brand.

Use table layout and inline CSS for email. Keep the original logo's proportions and colors. Do not regenerate, recolor, distort, add shadows, or recreate it as text unless explicitly requested. The embedded PNG uses `cid:tjmLogo` and MailApp `inlineImages`; preserve their matching key. This avoids public hosting, expiring links, and additional Drive permissions.

Inspect the actual preview at desktop and narrow widths after adapting labels or card counts. The treatment is a reusable application of the guide, not a requirement to use particular KPIs or customer wording.
