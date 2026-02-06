import fs from 'node:fs';
import path from 'node:path';

// Local sanity check helper.
// Usage: node scripts/parse_resume_local.mjs /absolute/path/to/resume.pdf
// Requires the dev server running on http://localhost:3000

const filePath = process.argv[2];
if (!filePath) {
  console.error('Missing file path. Example: node scripts/parse_resume_local.mjs /path/to/resume.pdf');
  process.exit(1);
}

const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error('File not found:', absPath);
  process.exit(1);
}

const buf = fs.readFileSync(absPath);
const fd = new FormData();
fd.set('resume', new Blob([buf], { type: 'application/pdf' }), path.basename(absPath));

const res = await fetch('http://localhost:3000/api/parse-resume', {
  method: 'POST',
  body: fd,
});

const json = await res.json().catch(() => null);

console.log('HTTP', res.status);
if (!json) {
  console.log('Non-JSON response');
  process.exit(res.ok ? 0 : 1);
}

if (!res.ok) {
  console.log(json);
  process.exit(1);
}

const text = String(json.parsedText ?? '');
console.log('fileType:', json.fileType);
console.log('parsedText length:', text.length);
console.log('parsedText preview:', text.slice(0, 600));
