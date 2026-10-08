# Axiom access and KPI definitions

## Obtain access

Ask for the dataset, organization ID, and an API token that can query that dataset. In Axiom, open the organization settings and API Tokens, and create a token with query/read access restricted to the required dataset. An ingest-only token cannot run this report. UI labels may change; use the visible controls and [current token documentation](https://axiom.co/docs/reference/tokens).

The organization ID appears in the Axiom URL, for example `axiom-example` in `https://app.axiom.co/axiom-example/datasets`. Have the user enter the key directly in Apps Script Project Settings → Script Properties → `AXIOM_TOKEN`, or use available secure secret entry. Do not print it or embed it in a generated file. Script editors can access Script Properties; keep the project limited to the intended maintainers.

The starter uses [Axiom's tabular query endpoint](https://axiom.co/docs/restapi/endpoints/queryApl), `https://api.axiom.co/v1/datasets/_apl?format=tabular`, with bearer authentication, `X-Axiom-Org-Id`, and explicit UTC `startTime`/`endTime`. Verify the endpoint and permitted data region for the user's organization when necessary. Do not treat a failed query as zero activity.

## Establish the meaning before writing the query

Inspect available fields and a small bounded sample for the selected bot. Apply verified service/customer/environment filters if its dataset is shared. A prescription/script line, a retry attempt, a document, a transfer, and a patient are different counting units. Pick the stable ID and deduplicate according to the requested meaning.

Suggested definitions to discuss, not mandatory KPIs:

| KPI | Definition to resolve |
|---|---|
| Processed scripts | Distinct script IDs with a successful final outcome in the window |
| Total scripts | All included final outcomes; explicitly decide whether skipped, failed, or unfinished scripts belong |
| Success rate | Processed divided by that agreed total; N/A for no eligible outcomes |
| Average time per script | Mean duration for the agreed population, normally processed scripts; establish units and missing-duration behavior |
| Skipped / failed scripts | Distinct IDs with those terminal outcomes, if logged and requested |

Do not count generic crash events as failed prescriptions without a reliable script correlation. Missing durations are not zero seconds. If failed scripts exist, do not silently exclude them from a denominator described as all scripts. Explain when metrics describe recorded workflow outcomes rather than independent correctness checks.

## Starter query for standard script outcomes

Only use the following when the selected bot actually emits these fields and statuses and the user agrees that total means processed + skipped. It is a candidate pipeline to insert into `METRICS_APL`, not an assertion about every bot. `reportQueries_` prepends the configured dataset. Add verified bot filters before the event filter when needed.

```apl
| where body startswith "[SCRIPT_OUTCOME]"
| extend script_id = tostring(['attributes.script_id']), status = tostring(['attributes.status']), duration_s = toreal(['attributes.duration_s'])
| summarize arg_max(_time, status, duration_s) by script_id
| where status in ("processed", "skipped")
| summarize scripts = countif(status == "processed"), skipped = countif(status == "skipped"), average_s = avgif(duration_s, status == "processed" and duration_s >= 0), missing_ids = countif(isempty(script_id) or script_id startswith "unknown")
```

This chooses each script's latest outcome **within the window**, not its lifetime state. Validate that interpretation and any ID reuse/retry behavior. The starter `reportMetrics_` expects `scripts`, `skipped`, and `average_s`; `reportForWindow_` also checks `missing_ids`. When adapting metrics, change these fields and checks together. If a KPI requires another query, use the same captured window for all queries.

Test bounded aggregates and compare a small sample before installation. Reject partial/estimated responses, diagnostic errors, missing correlation IDs, malformed aggregates, and invalid numeric values before sending. Preserve these checks when changing the schema. If data access is unavailable, supply the customized setup instructions and identify the query validation still required; never claim the report is live or fill gaps with invented data.
