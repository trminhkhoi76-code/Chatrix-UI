import fs from 'fs';
import zlib from 'zlib';
import { promisify } from 'util';

const gunzip = promisify(zlib.gunzip);
const html = fs.readFileSync('C:/Users/PC034-Local/Downloads/Chatrix.html', 'utf8');

// Extract manifest
const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const manifest = JSON.parse(manifestMatch[1]);
const keys = Object.keys(manifest);
console.log('Assets:', keys.length);

for (const k of keys) {
  const entry = manifest[k];
  console.log(`\n--- ${k} [${entry.type}] compressed:${entry.compressed} ---`);
  
  const binary = Buffer.from(entry.data, 'base64');
  let content;
  if (entry.compressed) {
    try {
      content = (await gunzip(binary)).toString('utf8');
    } catch(e) {
      content = `[gunzip error: ${e.message}]`;
    }
  } else {
    content = binary.toString('utf8');
  }
  
  if (entry.type === 'application/javascript') {
    // Save JS files
    const outPath = `C:/personal/Chatrix-UI/scripts/bundle-${k.slice(0,8)}.js`;
    fs.writeFileSync(outPath, content);
    console.log(`Saved ${content.length} chars to ${outPath}`);
  } else if (entry.type === 'text/css') {
    const outPath = `C:/personal/Chatrix-UI/scripts/bundle-${k.slice(0,8)}.css`;
    fs.writeFileSync(outPath, content);
    console.log(`Saved CSS ${content.length} chars to ${outPath}`);
  } else {
    console.log(`Type: ${entry.type}, size: ${binary.length} bytes`);
  }
}
