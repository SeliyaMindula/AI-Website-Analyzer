import { cpSync, existsSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/@imgly/background-removal-data/dist');
const dest = join(root, 'public/bg-removal');

// Vercel deploys skip ~200MB of model files; the app falls back to IMG.LY CDN in production.
if (process.env.VERCEL === '1' && process.env.BG_REMOVAL_SELF_HOST !== '1') {
  console.log('Skipping local model copy on Vercel (CDN fallback at runtime)');
  process.exit(0);
}

if (!existsSync(src)) {
  console.error('Missing @imgly/background-removal-data — run: npm install');
  process.exit(1);
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

const hasMeta =
  existsSync(join(dest, 'resources.json')) || existsSync(join(dest, 'metadata.json'));
if (!hasMeta) {
  console.error('Model copy failed — resources.json not found in public/bg-removal');
  process.exit(1);
}

console.log('Copied AI models to public/bg-removal');
