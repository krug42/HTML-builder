const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function createHtmlFromTemplate(templatePath, componentsPath, distPath) {
  const htmlName = 'index.html';
  const htmlPath = path.join(distPath, htmlName);

  try {
    let template = await fsPromises.readFile(templatePath, {
      encoding: 'utf-8',
    });

    const templateTags = template.match(/{{(\w+)}}/gm);

    for (const tag of templateTags) {
      let tagName = tag.match(/\w+/);

      let tagContent = await fsPromises.readFile(
        path.join(componentsPath, `${tagName}.html`),
        {
          encoding: 'utf-8',
        },
      );

      template = template.replace(tag, tagContent);
    }

    await fsPromises.appendFile(htmlPath, template);
  } catch (err) {
    console.error(err.message);
  }
}

async function bundleStyles(stylesPath, distPath) {
  const bundleName = 'style.css';
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

async function copyAssets(assetsPath, distPath) {
  try {
    await fsPromises.mkdir(distPath, { recursive: true });
    const entries = await fsPromises.readdir(assetsPath, {
      recursive: true,
      withFileTypes: true,
    });

    for (const entry of entries) {
      const originFilePath = path.join(assetsPath, entry.name);
      const copyFilePath = path.join(distPath, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(originFilePath, copyFilePath);
      }
      if (entry.isFile()) {
        await fsPromises.copyFile(originFilePath, copyFilePath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function processAll() {
  const distPath = path.join(__dirname, 'project-dist');
  try {
    await fsPromises.rm(distPath, { force: true, recursive: true });
    await fsPromises.mkdir(distPath, { recursive: true });
  } catch (err) {
    console.error(err.message);
  }

  createHtmlFromTemplate(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    path.join(distPath),
  );

  bundleStyles(path.join(__dirname, 'styles'), path.join(distPath));

  copyAssets(path.join(__dirname, 'assets'), path.join(distPath, 'assets'));
}

processAll();
