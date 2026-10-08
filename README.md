# TJM Metrics Report Skill

A guided assistant workflow for creating a TJM-branded bot metrics email using Axiom and Google Apps Script.

## What it does

1. Asks which KPIs you want: processed scripts, total scripts, success rate, average processing time, or your own metrics.
2. Collects your bot/report name, Axiom dataset and organization, reporting period, recipients, and delivery schedule.
3. Guides secure entry of an Axiom API key with query access.
4. Checks your bot's event schema and prepares the queries and Apps Script for your selected KPIs.
5. Builds a preview using the bundled TJM logo and branding.
6. Sets up Apps Script through available computer-use tools, or gives you the complete script and step-by-step manual instructions.
7. Sends a test and enables scheduled email when you request those actions.

The skill does not start sending emails when installed. You choose the metrics and recipients; transfers are optional. You handle account login, secure API-key entry, and Google permission approval when required.

## Install and run

Ask your assistant to install the skill from this repository:

> Install the create-metrics-report skill from https://github.com/seifhany-tjm/create-metrics-report. Its SKILL.md is at the repository root.

Then ask:

> Use create-metrics-report to help me set up a daily metrics email for my bot.

For manual installation, copy this repository's contents into your assistant's `create-metrics-report` skill folder, keeping the assets, references, and scripts together. Copying only `SKILL.md` omits the report template and branding.

## What you need

- An Axiom dataset containing your bot's events, its organization ID, and an API key with query access.
- A Google account that can run Google Apps Script and send email.
- Your preferred KPIs, recipients, reporting period, and schedule.

Enter credentials only through secure input or directly in Apps Script's Script Properties. Never commit API keys or recipient-specific configuration to this repository. Branding is included; no brand-folder access is needed.

## Included files

- [SKILL.md](SKILL.md): the guided workflow.
- [Apps Script template](assets/daily_report.gs): reusable email layout, query handling, preview, and daily trigger.
- [Axiom and KPI guide](references/axiom-kpis.md): schema checks, metric definitions, and a candidate query.
- [Apps Script setup](references/apps-script-setup.md): computer-use and manual setup, properties, email testing, and scheduling.
- [Branding guide](references/brand.md) and `assets/brand/`: bundled TJM assets.
- `scripts/preview.cjs` and `assets/daily_report.test.cjs`: local preview and checks.

The starter query is intentionally empty. The assistant fills it after checking your bot's schema and adapts the suggested KPI mapping to your choices. Daily trigger times are approximate; configure the reporting period and timezone explicitly.

## Local checks

With Node.js installed, run:

```sh
node assets/daily_report.test.cjs
node scripts/preview.cjs assets/daily_report.gs preview.html
```

These checks use sample data and mocked services; they do not query Axiom, send email, or install triggers. Adapt the preview inputs and tests when customizing the report's KPIs.
