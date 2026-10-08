// node preview.cjs path/to/report.gs path/to/preview.html
// Synthetic data only. No Apps Script services, network, email, or scheduling.
const fs = require('node:fs');
const vm = require('node:vm');
const [source, output] = process.argv.slice(2);
if (!source || !output) throw new Error('Usage: node preview.cjs report.gs preview.html');
const context = vm.createContext({Date, Utilities: {
  formatDate: (date, timeZone) => new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit',
    minute: '2-digit', second: '2-digit', timeZoneName: 'short', hourCycle: 'h23',
  }).format(date),
}});
vm.runInContext(fs.readFileSync(source, 'utf8'), context);
const metrics = context.reportMetrics_({scripts: 51, skipped: 11, average_s: 288.15});
const html = context.buildEmail_(context.reportingWindow_(new Date('2026-10-02T13:00:00Z')), metrics).html;
const logo = vm.runInContext('TJM_LOGO_BASE64', context);
fs.writeFileSync(output, html.replace('cid:tjmLogo', `data:image/png;base64,${logo}`)
  .replace('<title>', '<title>Sample preview | ')
  .replace('OPERATIONS REPORT', 'SAMPLE DATA'));
console.log(`Synthetic preview saved: ${output}`);
