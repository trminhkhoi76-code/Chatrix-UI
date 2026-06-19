const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('c:/Users/PC034-Local/Downloads/Chatrix Admin.html', 'utf8');

// Extract manifest
const mfStart = html.indexOf('<script type="__bundler/manifest">') + '<script type="__bundler/manifest">'.length;
const mfEnd = html.indexOf('</script>', mfStart);
const manifest = JSON.parse(html.slice(mfStart, mfEnd).trim());

// Find the JS entry (text/javascript)
const jsUuid = Object.keys(manifest).find(k => manifest[k].mime === 'text/javascript');
console.log('JS UUID:', jsUuid);
console.log('Compressed:', manifest[jsUuid].compressed);

const entry = manifest[jsUuid];
const buf = Buffer.from(entry.data, 'base64');
if (entry.compressed) {
  zlib.gunzip(buf, (err, result) => {
    if (err) { console.error('gunzip error:', err); process.exit(1); }
    const src = result.toString('utf8');
    console.log('Source length:', src.length);
    fs.writeFileSync('c:/personal/Chatrix-UI/scripts/admin-source.js', src);
    console.log('Written to admin-source.js');
  });
} else {
  const src = buf.toString('utf8');
  fs.writeFileSync('c:/personal/Chatrix-UI/scripts/admin-source.js', src);
  console.log('Written to admin-source.js, length:', src.length);
}
