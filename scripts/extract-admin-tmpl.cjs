const fs = require('fs');
const html = fs.readFileSync('c:/Users/PC034-Local/Downloads/Chatrix Admin.html', 'utf8');

// Extract JSON-encoded template string
const tmTag = '<script type="__bundler/template">';
const tmStart = html.indexOf(tmTag) + tmTag.length;
const tmEnd = html.indexOf('</script>', tmStart);
const raw = html.slice(tmStart, tmEnd).trim();

try {
  const template = JSON.parse(raw);
  fs.writeFileSync('c:/personal/Chatrix-UI/scripts/admin-template.html', template, 'utf8');
  console.log('Template written, length:', template.length);
} catch(e) {
  console.error('JSON parse failed:', e.message);
  console.log('First 200 chars raw:', raw.slice(0, 200));
}
