import fs from 'fs';

const html = fs.readFileSync('C:/Users/PC034-Local/Downloads/Chatrix.html', 'utf8');

// Reconstruct the template HTML from the character map
const tmplMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const tmpl = JSON.parse(tmplMatch[1]);

// It's a char-indexed object, reconstruct the string
const len = Object.keys(tmpl).length;
let templateStr = '';
for (let i = 0; i < len; i++) {
  templateStr += tmpl[i];
}

fs.writeFileSync('C:/personal/Chatrix-UI/scripts/template.html', templateStr);
console.log('Template length:', templateStr.length);
console.log('Template preview (first 1000):', templateStr.slice(0, 1000));

// Also look for inline script/style with theme logic
const inlineScripts = templateStr.match(/<script[\s\S]*?<\/script>/g) || [];
console.log('\nInline scripts count:', inlineScripts.length);
inlineScripts.forEach((s, i) => {
  console.log(`\nScript ${i} (first 500):`, s.slice(0, 500));
});

const inlineStyles = templateStr.match(/<style[\s\S]*?<\/style>/g) || [];
console.log('\nInline styles count:', inlineStyles.length);
inlineStyles.forEach((s, i) => {
  console.log(`\nStyle ${i} (first 1000):`, s.slice(0, 1000));
});
