const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('readline');

let fileWS = fs.createWriteStream(path.join(__dirname, 'output.txt'));
let rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(
  'Please, type some text, which will be written to output.txt, or type "exit" to exit prompt:\n',
);
rl.prompt();

rl.on('line', (data) => {
  if (data === 'exit') printFarewell();
  else {
    fileWS.write(data);
    rl.prompt();
  }
});

rl.on('SIGINT', printFarewell);

function printFarewell() {
  rl.setPrompt('You have exited the prompt\n');
  rl.prompt();
  rl.close();
}
