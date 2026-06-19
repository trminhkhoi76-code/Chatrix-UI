const fs = require('fs');
const html = fs.readFileSync('C:/Users/PC034-Local/Downloads/Chatrix.html', 'utf8');
const tmplMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const tmpl = JSON.parse(tmplMatch[1]);
const len = Object.keys(tmpl).length;
let s = '';
for (let i = 0; i < len; i++) s += tmpl[i];

// Find the script with data-dc-script attribute - it has the source code inline as escaped HTML
// The content is between the script tags with data-dc-script
const fullScriptMatch = s.match(/<script[^>]+data-dc-script[^>]*>([\s\S]*?)<\/script>/s);
if (fullScriptMatch) {
  const src = fullScriptMatch[1];
  console.log('Script content length:', src.length);
  console.log('First 3000 chars:\n', src.slice(0, 3000));
  fs.writeFileSync('C:/personal/Chatrix-UI/scripts/dc-script.ts', src);
} else {
  // Try finding the data-dc-script differently
  const idx = s.indexOf('data-dc-script');
  console.log('data-dc-script found at index:', idx);
  if (idx > 0) {
    console.log('Context around it:', s.slice(idx, idx + 3000));
  }
}
