import fs from 'fs';
import zlib from 'zlib';
import { promisify } from 'util';

const gunzip = promisify(zlib.gunzip);
const html = fs.readFileSync('C:/Users/PC034-Local/Downloads/Chatrix.html', 'utf8');

// Extract ext_resources to get mime types
const extMatch = html.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/);
if (extMatch) {
  const extData = JSON.parse(extMatch[1]);
  console.log('Ext resources:', JSON.stringify(extData, null, 2).slice(0, 2000));
}

// Extract template to understand structure
const tmplMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (tmplMatch) {
  const tmpl = JSON.parse(tmplMatch[1]);
  console.log('\nTemplate keys:', Object.keys(tmpl));
  if (typeof tmpl === 'string') {
    console.log('Template (first 500):', tmpl.slice(0, 500));
  } else {
    console.log('Template:', JSON.stringify(tmpl).slice(0, 1000));
  }
}

// Extract manifest
const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const manifest = JSON.parse(manifestMatch[1]);

for (const [k, entry] of Object.entries(manifest)) {
  const binary = Buffer.from(entry.data, 'base64');
  let content;
  if (entry.compressed) {
    try {
      content = (await gunzip(binary)).toString('utf8');
    } catch(e) {
      content = binary.toString('utf8');
    }
  } else {
    content = binary.toString('utf8');
  }
  const preview = content.slice(0, 200).replace(/\n/g, ' ');
  console.log(`\nAsset ${k.slice(0,8)}: "${preview}"`);
  
  // Detect type and save
  let ext = 'bin';
  if (content.includes('React') || content.includes('useState') || content.includes('function') || content.startsWith('(()=>') || content.startsWith('!function')) ext = 'js';
  if (content.trimStart().startsWith('*,') || content.includes('@theme') || content.includes('--tw')) ext = 'css';
  if (content.trimStart().startsWith('<!') || content.trimStart().startsWith('<html')) ext = 'html';
  
  const outPath = `C:/personal/Chatrix-UI/scripts/bundle-${k.slice(0,8)}.${ext}`;
  fs.writeFileSync(outPath, content);
  console.log(`  -> saved as .${ext} (${content.length} chars)`);
}
