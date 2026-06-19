const fs = require('fs');
const html = fs.readFileSync('c:/personal/Chatrix-UI/scripts/admin-template.html', 'utf8');
const tag = 'text/x-dc';
const scriptStart = html.lastIndexOf('<script type="' + tag + '"');
const scriptEnd = html.lastIndexOf('</script>');
const script = html.slice(scriptStart, scriptEnd + 9);
fs.writeFileSync('c:/personal/Chatrix-UI/scripts/admin-dc-script.js', script, 'utf8');
console.log('Script written, length:', script.length);
