const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function bundleStyles(stylesPath, distPath) {
  const bundleName = 'bundle.css';
  const bundlePath = path.join(distPath, bundleName);

  try {
    const entries = await fsPromises.readdir(stylesPath, {
      withFileTypes: true,
    });

    const files = entries.filter(
      (entry) => entry.isFile() && path.extname(entry.name) === '.css',
    );

    await fsPromises.rm(bundlePath, { force: true });

    for (let i = 0; i < files.length; i++) {
      let content = await fsPromises.readFile(
        path.join(stylesPath, files[i].name),
      );

      content = i === files.length - 1 ? content : content + '\n';

      await fsPromises.appendFile(bundlePath, content);
    }
  } catch (err) {
    console.error(err.message);
  }
}

bundleStyles(
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'project-dist'),
);
