# Apps Script setup: browser or manual

Follow these same steps with computer use when available. If unavailable, give the user the customized `.gs` file plus a numbered checklist using their settings and the property names below. Do not just link this reference or tell them to “deploy the script.”

## 1. Create or open the project

Open [Google Apps Script](https://script.google.com/) in the agreed Google account and choose **New project**, or open the user's existing project. Name it for their bot/report. A dedicated standalone script is sufficient; no spreadsheet or Web app deployment is needed. The account that installs the trigger owns its scheduled execution and sends the email.

For an existing project, read and back up its complete source and inspect its current triggers/settings before editing. Preserve unrelated functions, properties, and triggers. Compare local and cloud source instead of assuming either is current.

## 2. Paste the prepared source

In **Editor**, open **Code.gs**. In a new project replace the starter `myFunction` with the entire generated `.gs` file, including the embedded logo. Save. For an existing project apply only the intended replacement. Read back the saved source to verify it.

The generated source must already have the chosen title in `REPORT_NAME`, timezone in `REPORT_TIMEZONE`, verified query in `METRICS_APL`, KPI mapping in `reportMetrics_`, and the requested time in `DELIVERY_HOUR` / `DELIVERY_MINUTE`. The shipped starter deliberately has no runnable query. The agent prepares these values; do not require the user to invent APL.

Through computer use, operate the visible editor and supported keyboard/copy/paste controls. Do not use hidden editor state or guessed internal RPCs.

## 3. Set timezone, API key, and email recipients

Open **Project Settings** (gear). Set the timezone to match `REPORT_TIMEZONE` and keep the V8 runtime enabled. Use the agreed IANA timezone, such as `America/Toronto` for daylight-saving Eastern time. Do not infer a timezone from the account or computer.

Under **Script Properties**, choose **Add script property** (or **Edit script properties**), add these four rows, then **Save script properties**:

| Property | What the user enters |
|---|---|
| `AXIOM_TOKEN` | Their API key with query access to the chosen dataset; enter securely here |
| `AXIOM_ORG_ID` | Their Axiom organization ID |
| `AXIOM_DATASET` | Their bot's exact dataset name |
| `RECIPIENT_EMAILS` | Their agreed recipient addresses, comma separated |

These are property names, not code to paste into `Code.gs`. Preserve unrelated existing properties. Never include the token in shared source, screenshots, logs, or the final response. Pause for direct user entry if secure token access is unavailable, then continue. The project editors can access these properties.

## 4. Run a preview without email

Return to **Editor**. In the function dropdown select **previewLast24HoursReport**, then **Run**. Verify the selection first; selecting `sendLast24HoursReport` sends immediately. Adapt the handler name here if the generated report uses a different period.

If Google requests authorization, have the user sign in and approve the required permissions for their project. The script uses external requests and email; installing triggers also requires trigger management. Stop at an account/security block and report it rather than bypassing it.

Check **Execution log** for success, the exact reporting period, selected KPI values, and sensible zero/N/A behavior. A permission, query, schema, or configuration error must be fixed before sending or enabling delivery. The preview queries Axiom and logs aggregate text without sending email. The local HTML preview uses visibly marked sample data; it is not evidence of live values.

## 5. Send an authorized test

Only if the user requested an immediate test, verify `RECIPIENT_EMAILS` matches the authorized test audience, select **sendLast24HoursReport**, and click **Run** once. This sends to every configured address; rerunning sends another copy. If using a test address, restore the agreed scheduled audience before installing the trigger.

Check **Executions** for success. Inspect the received email when inbox access is available and authorized, or ask the user to confirm receipt and appearance. Do not report inbox delivery based only on execution success.

## 6. Enable the requested schedule

For daily delivery, verify the chosen hour/minute/timezone in the source, then select **installDailyTrigger** and **Run** once. Open **Triggers** (clock icon) and verify one intended time-driven report handler. The starter replaces only its own report handler's triggers; preserve unrelated triggers. For an existing legacy report, inspect whether its old handler needs removal to prevent duplicate emails, and remove only the obsolete report trigger within the authorized change.

The starter is daily; customize the installer for another agreed cadence before running it. Do not silently use daily delivery for a weekly request. Do not install or replace triggers for a preview-only or style-only request.

Google's `nearMinute` timing is approximate (plus/minus 15 minutes), not an exact send-time guarantee. Latest-24-hour windows subtract exactly 86,400,000 ms; varied trigger times can cause small gaps/overlaps between reports. Previous calendar-day totals need timezone-aware date boundaries instead. Preserve the user's chosen time semantics.

## 7. Handoff and future edits

Return the project link, source/preview, selected KPIs and definitions, reporting window, agreed schedule/timezone, and actual completed steps. With manual setup, list precisely what the user must run and what remains unverified.

Tell the user: change recipients in **Project Settings → Script Properties → RECIPIENT_EMAILS**; change delivery time in the source and rerun the installer; pause delivery by deleting this report's trigger under **Triggers**. Inspect failed runs under **Executions**. Observe a future scheduled run only if that follow-up is requested.

## Official references

- [Script Properties setup](https://developers.google.com/apps-script/guides/properties)
- [MailApp and inline images](https://developers.google.com/apps-script/reference/mail/mail-app)
- [Time-driven trigger timing](https://developers.google.com/apps-script/reference/script/clock-trigger-builder)
- [Axiom tokens](https://axiom.co/docs/reference/tokens)
- [Axiom query endpoint](https://axiom.co/docs/restapi/endpoints/queryApl)
