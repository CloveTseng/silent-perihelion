import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Usage: node scripts/release.js <version> (e.g., 0.1.4)');
  process.exit(1);
}

// Ensure version format (simple check)
if (!/^\d+\.\d+\.\d+/.test(newVersion)) {
   console.warn('⚠️ Warning: Version format should ideally be x.y.z');
}

console.log(`🚀 Bumping version to ${newVersion}...`);

// 1. Update package.json
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('✅ Updated package.json');

// 2. Update README.md
const readmePath = path.resolve(__dirname, '../README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
// Replace "當前版本: **vX.X.X**"
const readmeRegex = /當前版本: \*\*v.*?\*\*/;
if (readmeRegex.test(readme)) {
    readme = readme.replace(readmeRegex, `當前版本: **v${newVersion}**`);
    fs.writeFileSync(readmePath, readme);
    console.log('✅ Updated README.md version');
} else {
    console.warn('⚠️ Could not find version string in README.md to update.');
}

// 3. Update CHANGELOG.md
const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    const newEntry = `## v${newVersion} (${today})\n*   **WIP**: (在此手動新增變更內容)\n\n`;
    
    // Insert after "# Changelog" header
    // Assuming file starts with "# Changelog"
    const header = "# Changelog";
    if (changelog.startsWith(header)) {
        changelog = changelog.replace(header, header + '\n\n' + newEntry.trim());
        fs.writeFileSync(changelogPath, changelog);
        console.log('✅ Updated CHANGELOG.md with new section');
    } else {
         console.warn('⚠️ CHANGELOG.md does not start with "# Changelog", skipping auto-prepend.');
    }
} else {
    console.warn('⚠️ CHANGELOG.md not found.');
}

console.log(`\n🎉 Version bumped to ${newVersion}. Don't forget to fill in CHANGELOG.md!`);
