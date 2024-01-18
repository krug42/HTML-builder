const { readdir, stat } = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function printFiles() {
  try {
    const entries = await readdir(secretFolderPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (entry.isFile()) {
        const extenstion = path.extname(entry.name);
        const name =
          extenstion === '' ? entry.name : entry.name.replace(extenstion, '');
        const stats = await stat(path.join(secretFolderPath, entry.name));
        const size = (stats.size / 1024).toFixed(3);
        process.stdout.write(
          `${name} - ${
            extenstion.replace('.', '') || 'no extension'
          } - ${size}kb\n`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

printFiles();
