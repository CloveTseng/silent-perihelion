import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');

if (!fs.existsSync(changelogPath)) {
  console.error('❌ CHANGELOG.md not found!');
  process.exit(1);
}

const content = fs.readFileSync(changelogPath, 'utf8');

// Regex to find the first version section
// Matches "## vX.X.X ..." until the next "## v..." or end of file
const versionRegex = /^## v.*?$(.*?)(?=^## v|$(?![\r\n]))/ms;
const match = content.match(versionRegex);

if (match && match[1]) {
  const latestNotes = match[1].trim();
  console.log(latestNotes);
  
  // Also write to a file for GitHub Actions "body_path" if needed, 
  // or the action can capture stdout.
  const notesPath = path.resolve(__dirname, '../release-notes.md');
  fs.writeFileSync(notesPath, latestNotes);
  console.error('✅ Extracted release notes to release-notes.md');
} else {
  console.error('⚠️ Could not find latest version notes in CHANGELOG.md');
  process.exit(0); // Exit success but empty
}
