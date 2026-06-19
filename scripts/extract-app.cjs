const fs = require('fs');
const html = fs.readFileSync('C:/Users/PC034-Local/Downloads/Chatrix.html', 'utf8');
const tmplMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const tmpl = JSON.parse(tmplMatch[1]);
const len = Object.keys(tmpl).length;
let s = '';
for (let i = 0; i < len; i++) s += tmpl[i];

fs.writeFileSync('C:/personal/Chatrix-UI/scripts/app-source.html', s);
console.log('Full template length:', s.length);

// Find the dc-script content (the actual app TypeScript/JS source)
const dcScriptMatch = s.match(/data-dc-script="([^"]*)"[\s\S]*?<\/script>/);
const dcPropsMatch = s.match(/data-props="([^"]+)"/);
if (dcPropsMatch) {
  const props = JSON.parse(dcPropsMatch[1].replace(/&quot;/g, '"'));
  console.log('\nComponent props:', JSON.stringify(props, null, 2));
}

// Find ALL script content in x-dc
const xdcMatch = s.match(/<x-dc>([\s\S]*)<\/x-dc>/);
if (xdcMatch) {
  const xdc = xdcMatch[1];
  // Get data-dc-script attribute content  
  const scriptContentMatch = xdc.match(/<script[^>]+data-dc-script[^>]*>([\s\S]*?)<\/script>/);
  if (scriptContentMatch) {
    console.log('\nScript content (first 5000):', scriptContentMatch[1].slice(0, 5000));
    fs.writeFileSync('C:/personal/Chatrix-UI/scripts/dc-script.ts', scriptContentMatch[1]);
  }
}
