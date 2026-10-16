
import { access } from 'node:fs/promises';

const files = [
  'index.html',
  'app.js',
  'styles.css',
  'seed-data.js'
];

for (const file of files) {
  try {
    await access(file);
    console.log(`Found: ${file}`);
  } catch {
    if (file === 'styles.css') {
      console.warn('styles.css not found; check whether CSS is inline in index.html.');
    } else {
      throw new Error(`Required file missing: ${file}`);
    }
  }
}

console.log('Build check passed.');
