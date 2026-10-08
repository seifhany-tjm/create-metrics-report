// Run: node assets/daily_report.test.cjs (no network, mail, or real triggers).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sent = [], requests = [], deleted = [], created = [];
let values = {scripts: 51, skipped: 11, average_s: 288.15, missing_ids: 0};
const properties = {AXIOM_TOKEN: 'test-token', AXIOM_ORG_ID: 'test-org',
  AXIOM_DATASET: 'example-bot', RECIPIENT_EMAILS: 'test@example.com'};
const row = value => ({status: {isPartial: false}, tables: [{
  fields: Object.keys(value).map(name => ({name})), columns: Object.values(value).map(item => [item]),
}]});
const services = {console: {log() {}}, Date, Utilities: {
  base64Decode: value => Buffer.from(value, 'base64'),
  newBlob: (bytes, type, name) => ({bytes, type, name}),
  formatDate: date => date.toISOString(),
}, PropertiesService: {getScriptProperties: () => ({getProperty: key => properties[key]})},
MailApp: {sendEmail: email => sent.push(email)}, UrlFetchApp: {
  fetch(url, options) {
    requests.push({url, ...JSON.parse(options.payload)});
    return {getResponseCode: () => 200, getContentText: () => JSON.stringify(row(values))};
  },
}, ScriptApp: {
  getProjectTriggers: () => ['sendLast24HoursReport', 'unrelatedHandler'].map(name => ({getHandlerFunction: () => name})),
  deleteTrigger: trigger => deleted.push(trigger.getHandlerFunction()),
  newTrigger(handler) {
    const settings = {handler};
    const builder = Object.fromEntries(['timeBased', 'atHour', 'nearMinute', 'everyDays', 'inTimezone'].map(key =>
      [key, value => {settings[key] = value; return builder;}]));
    builder.create = () => created.push(settings);
    return builder;
  },
}};
const source = fs.readFileSync(`${__dirname}/daily_report.gs`, 'utf8');
const unconfigured = vm.createContext({...services});
vm.runInContext(source, unconfigured);
assert.throws(() => unconfigured.sendLast24HoursReport(), /METRICS_APL/);
assert.throws(() => unconfigured.installDailyTrigger(), /METRICS_APL/);
assert.equal(requests.length + sent.length + created.length + deleted.length, 0);
const guide = fs.readFileSync(`${__dirname}/../references/axiom-kpis.md`, 'utf8');
const apl = guide.match(/```apl\n([\s\S]*?)```/)[1];
const context = vm.createContext({...services});
vm.runInContext(source.replace("const METRICS_APL = '';", `const METRICS_APL = ${JSON.stringify(apl)};`), context);
for (const end of ['2026-09-25T13:47:23.123Z', '2026-03-08T16:00:00Z', '2026-11-01T16:00:00Z']) {
  const now = new Date(end), window = context.reportingWindow_(now);
  assert.equal(window.end.toISOString(), now.toISOString());
  assert.equal(window.end - window.start, 86400000);
  now.setTime(0);
  assert.notEqual(window.end.getTime(), 0);
}
assert.throws(() => context.reportingWindow_(new Date(NaN)));
const window = context.reportingWindow_(new Date('2026-09-25T13:47:23.123Z'));
const report = context.reportForWindow_(window);
assert.match(report.text, /Scripts processed: 51/);
assert.match(report.text, /Skipped scripts: 11/);
assert.match(report.text, /Total scripts: 62/);
assert.match(report.text, /Success rate: 82.3%/);
assert.match(report.text, /Average time per script: 288.1s/);
assert.doesNotMatch(report.text + report.html, /transfers/i);
assert(requests.every(request => request.startTime === window.start.toISOString() && request.endTime === window.end.toISOString()));
assert(requests.every(request => request.apl.startsWith('["example-bot"]')));
context.previewLast24HoursReport();
assert.equal(sent.length, 0);
values = {scripts: 0, skipped: 0, average_s: null, missing_ids: 0};
context.sendLast24HoursReport();
assert.equal(sent.length, 1);
assert.equal(sent[0].name, 'TJM Labs');
assert.match(sent[0].body, /Success rate: N\/A/);
assert.match(sent[0].body, /Average time per script: N\/A/);
assert.deepEqual(sent[0].inlineImages.tjmLogo.bytes, fs.readFileSync(`${__dirname}/brand/tjm-logo.png`));
assert.match(sent[0].htmlBody, /src="cid:tjmLogo"/);
assert.match(context.buildEmail_(window, context.reportMetrics_({scripts: 0, skipped: 3, average_s: null})).text, /Success rate: 0.0%/);
for (const size of [1, 4, 5, 6]) {
  const metrics = Array.from({length: size}, (_, index) => ({label: `Custom KPI ${index}`, value: index}));
  const html = context.buildEmail_(window, metrics).html;
  assert.equal((html.match(/class="metric-value"/g) || []).length, size);
  assert.equal((html.match(/<td width="50%"><\/td>/g) || []).length, size % 2);
}
const escaped = context.buildEmail_(window, [{label: '<b>A&B</b>', value: '<script>'}]).html;
assert.match(escaped, /&lt;b&gt;A&amp;B&lt;\/b&gt;/);
assert.doesNotMatch(escaped, /<script>/);
assert.throws(() => context.buildEmail_(window, []));
for (const status of [{isPartial: true}, {isEstimate: true}, {messages: ['query issue']}]) {
  assert.throws(() => context.readAxiomRow_({...row(values), status}));
}
assert.throws(() => context.readAxiomRow_({tables: []}));
assert.throws(() => context.count_({value: null}, 'value'));
for (const bad of [{...values, missing_ids: 1}, {...values, scripts: -1}, {scripts: 0, skipped: 0, missing_ids: 0}, {...values, average_s: -2}]) {
  values = bad;
  assert.throws(() => context.sendLast24HoursReport());
  assert.equal(sent.length, 1);
}
const savedEmail = properties.RECIPIENT_EMAILS;
properties.RECIPIENT_EMAILS = 'invalid';
assert.throws(() => context.configuration_(), /RECIPIENT_EMAILS/);
properties.RECIPIENT_EMAILS = savedEmail;
delete properties.AXIOM_DATASET;
assert.throws(() => context.configuration_(), /AXIOM_DATASET/);
properties.AXIOM_DATASET = 'another-bot';
assert(context.reportQueries_(context.configuration_()).startsWith('["another-bot"]'));
context.installDailyTrigger();
assert.deepEqual(deleted, ['sendLast24HoursReport']);
assert.equal(created.length, 1);
assert.equal(created[0].atHour, 9);
assert.equal(created[0].inTimezone, 'UTC');
context.UrlFetchApp.fetch = () => ({getResponseCode: () => 403});
assert.throws(() => context.sendLast24HoursReport(), /403/);
assert.equal(sent.length, 1);
console.log('Passed: unconfigured no-send, rolling windows, KPIs, custom cards, escaping, inline logo, preview, invalid-result no-send, properties, and trigger isolation.');
