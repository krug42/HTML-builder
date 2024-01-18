const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function copyDir(originDirPath) {
  try {
    const copyDirPath = originDirPath + '-copy';
    await fsPromises.rm(copyDirPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyDirPath, { recursive: true });
    const files = await fsPromises.readdir(originDirPath);

    for (const file of files) {
      const originFilePath = path.join(originDirPath, file);
      const copyFilePath = path.join(copyDirPath, file);
      await fsPromises.copyFile(originFilePath, copyFilePath);
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir(path.join(__dirname, 'files'));
