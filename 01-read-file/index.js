const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf8',
});

stream.on('data', (chunk) => {
  process.stdout.write(chunk);
});
