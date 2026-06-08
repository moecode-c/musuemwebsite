const fs = require('fs').promises;
const path = require('path');

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    return files; // ignore permission errors
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git'].includes(e.name)) continue;
      await walk(full, files);
    } else if (e.isFile()) {
      try {
        const st = await fs.stat(full);
        files.push({ path: full, size: st.size });
      } catch (err) {
        // ignore
      }
    }
  }
  return files;
}

(async () => {
  const root = process.cwd();
  const files = await walk(root, []);
  files.sort((a, b) => b.size - a.size);
  const top = files.slice(0, 50);
  for (const f of top) {
    console.log(`${f.path}\t${(f.size / 1024 / 1024).toFixed(2)} MB\t${f.size} bytes`);
  }
})();
