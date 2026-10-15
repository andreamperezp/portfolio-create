// Genera los PDF del CV a partir de cv-es.html y cv-en.html con Edge o Chrome en modo headless.
// Uso: node cv/build.mjs
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = browsers.find(existsSync);
if (!browser) throw new Error('No encontré Edge ni Chrome. Definí CHROME_PATH.');

for (const lang of ['es', 'en']) {
  const out = join(dir, `CV-Andrea-Perez-${lang.toUpperCase()}.pdf`);
  execFileSync(browser, [
    '--headless=new', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cv-'))}`, '--disable-gpu', '--no-pdf-header-footer',
    '--allow-file-access-from-files', '--virtual-time-budget=4000',
    `--print-to-pdf=${out}`, pathToFileURL(join(dir, `cv-${lang}.html`)).href,
  ], { stdio: 'inherit' });
  console.log('✓', out);
}
