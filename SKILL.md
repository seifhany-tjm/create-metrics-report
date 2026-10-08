---
name: create-metrics-report
description: Guide a user through choosing KPIs and setting up a TJM-branded bot metrics email from Axiom. Build the customized Google Apps Script and configure it through computer use when available, or provide exact manual setup steps. Use for creating, restyling, or scheduling metrics email reports for any bot.
---

# Create metrics report

Run this as a guided setup conversation, then do the setup. The reusable parts are TJM branding, email layout, and delivery mechanics. Customer names, KPIs, queries, recipients, time windows, and schedules belong to each user's report.

## 1. Ask about the report

For a new report, make the first question: **“Which KPIs would you like in the email?”** Suggest processed scripts, success rate, total scripts, and average time per script; offer skipped or failed scripts when useful. These are suggestions, not a required metric set. Include transfers only if the user requests them or identifies a transfer workflow. Support other bot-specific KPIs as well.

Then collect these decisions in short rounds, reusing answers already supplied:

- Which bot/customer is this for, and what title should appear in the email? A customer name is optional; TJM is the shared branding.
- Which reporting period should it cover? Suggest the latest 24 hours; distinguish this from the previous calendar day or working day.
- Which Axiom dataset and organization contain this bot's events? Ask for service/customer/environment filters if the dataset is shared; help discover unknown fields instead of making the user design APL.
- **Ask the user to provide an Axiom API key with query access to the chosen dataset.** Offer secure entry directly into Apps Script's `AXIOM_TOKEN` property or an available secret-input mechanism. Do not ask them to paste secrets into ordinary chat. Explain where to create a token using [references/axiom-kpis.md](references/axiom-kpis.md). Existing connector access can help inspect data, but scheduled Apps Script still needs its own token.
- Who should receive the email? What time, timezone, and cadence should delivery use? Do they want a test email now, scheduled delivery, or only a preview?
- Which Google account will own/send the report? Use an existing Apps Script project URL or create a dedicated project as part of the requested setup.

Ask for missing decisions before dependent work; continue preparing the branded source while waiting. Do not ask for logos, brand colors, or access to a brand Drive folder: everything needed for the standard report is bundled. For an existing report edit, inspect its source/settings and ask only what the change leaves undecided.

## 2. Define and verify the KPIs

Read [references/axiom-kpis.md](references/axiom-kpis.md). Inspect the actual schema and bounded events using available Axiom tools, the API with securely supplied credentials, or the Axiom UI. Verify the chosen bot's filters, IDs, statuses, deduplication, and durations. Briefly state each KPI's definition and denominator in plain language; ask only when the business meaning is ambiguous. Never silently substitute another KPI when evidence is missing.

Copy [assets/daily_report.gs](assets/daily_report.gs) to the user's report workspace. Its suggested script metrics are a starting point, not a universal schema. Fill `METRICS_APL` with a validated pipeline, adapt `reportMetrics_` to the selected KPIs, and set `REPORT_NAME`, timezone, and delivery time. The empty pipeline intentionally prevents the unconfigured starter from querying or sending. For a different period or cadence, update window calculation, labels, handler/trigger, preview, and checks together.

Return only aggregate metrics to the email. Keep API keys in Script Properties, never in source, previews, logs, or this shared skill. Do not carry any customer's dataset, credentials, recipients, project link, or private events into the published bundle.

## 3. Apply bundled branding and preview

Read [references/brand.md](references/brand.md). Reuse the original embedded logo and the purple/lavender email layout automatically. Adapt metric cards to the chosen number and order; do not add metrics to fill space. Preserve logo proportions and colors unless the user explicitly requests an alteration. No image generation, asset hosting, or branding rediscovery is needed.

Run `node scripts/preview.cjs path/to/report.gs path/to/preview.html`, adjusting the synthetic inputs to match customized KPIs. Open and inspect desktop and narrow-screen rendering, including long labels and zero/N/A values. Mark sample data visibly. Run `node assets/daily_report.test.cjs` for the starter and adapt a copy of the checks for the generated report's definitions, period, and parser. Keep no-send preview and failed-query-no-send behavior.

## 4. Set up Apps Script

Read [references/apps-script-setup.md](references/apps-script-setup.md).

- **Computer use available:** perform the requested project creation/edit, source paste/save/readback, properties setup, preview, and authorized test/schedule through the browser UI. Pause for the user's login, secure key entry, or Google permission approval when needed, then resume. Do not hand off a checklist merely because UI work takes effort.
- **Computer use unavailable or the user prefers manual setup:** provide the complete customized `.gs` file and the numbered manual steps from the reference, filled with their agreed non-secret settings. Tell them exactly where to paste code, enter emails/API properties, run the preview, authorize, send a requested test, and enable a requested schedule. State which live checks remain for them.

Complete already-authorized setup without repeated permission questions. A preview-only request does not authorize email or a trigger. An agreed schedule authorizes its future sends; it does not automatically authorize an extra immediate test email.

Finish with the report source/preview and project link when available, chosen KPIs, reporting period, recipient configuration, and delivery state. Distinguish saved source, successful live query, sent test, received email, installed trigger, and observed scheduled execution.
