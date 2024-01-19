const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function copyDir(originDirPath, copyDirPath) {
  try {
    await fsPromises.rm(copyDirPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyDirPath, { recursive: true });
    const entries = await fsPromises.readdir(originDirPath, {
      recursive: true,
      withFileTypes: true,
    });

    for (const entry of entries) {
      const originFilePath = path.join(originDirPath, entry.name);
      const copyFilePath = path.join(copyDirPath, entry.name);

      if (entry.isDirectory()) {
        await copyDir(originFilePath, copyFilePath);
      }
      if (entry.isFile()) {
        await fsPromises.copyFile(originFilePath, copyFilePath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
