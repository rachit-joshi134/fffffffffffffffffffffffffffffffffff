
import { access, readFile } from 'node:fs/promises';

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

// Check common website entry points.
// Supports either root-level files or files in public/.
const candidates = {
  html: ['public/index.html', 'index.html'],
  js: ['public/app.js', 'app.js'],
  css: ['public/styles.css', 'styles.css'],
};

async function findExisting(paths, label) {
  for (const path of paths) {
    if (await exists(path)) return path;
  }

  console.warn(`Optional ${label} not found.`);
  return null;
}

const htmlPath = await findExisting(candidates.html, 'HTML entry');
const jsPath = await findExisting(candidates.js, 'JavaScript');
const cssPath = await findExisting(candidates.css, 'stylesheet');

if (!htmlPath) {
  throw new Error(
    'No index.html found. Add index.html to the project root or public/.'
  );
}

const html = await readFile(htmlPath, 'utf8');

for (const [path, label] of [
  [jsPath, 'JavaScript'],
  [cssPath, 'stylesheet'],
]) {
  if (path && !html.includes(path.split('/').pop())) {
    console.warn(
      `${label} exists at ${path}, but its filename was not found in ${htmlPath}. Check the HTML asset reference.`
    );
  }
}

// Validate seed data only when the file exists.
const seedCandidates = [
  'netlify/functions/seed.json',
  'seed.json',
  'public/seed-data.js',
];

let seedPath = null;
for (const path of seedCandidates) {
  if (await exists(path)) {
    seedPath = path;
    break;
  }
}

if (seedPath?.endsWith('.json')) {
  try {
    const seed = JSON.parse(await readFile(seedPath, 'utf8'));

    if (Array.isArray(seed.drivers)) {
      const ids = seed.drivers.map((driver) => driver.id);
      if (new Set(ids).size !== ids.length) {
        throw new Error('Duplicate driver IDs found in seed data.');
      }

      console.log(`Found ${seed.drivers.length} driver records.`);
    } else {
      console.warn('Seed JSON has no drivers array.');
    }
  } catch (error) {
    throw new Error(`Invalid seed data (${seedPath}): ${error.message}`);
  }
} else if (seedPath) {
  console.log(`Found seed-data file: ${seedPath}`);
} else {
  console.warn('No seed-data file found; skipping driver-data validation.');
}

console.log(`Build check passed: ${htmlPath} exists.`);
