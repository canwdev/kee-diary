const {exec, spawn} = require('child_process');
const net = require('net');

const port = process.env.PORT || 5001;
process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const fe = spawn('yarn run dev:frontend', { shell: true });
fe.stdout.on('data', (data) => {
  console.log(`${data}`);
});

fe.stderr.on('data', (data) => {
  console.error(`${data}`);
});

fe.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;
      exec('yarn run dev:electron');
    }
  }
);

tryConnection();

client.on('error', (error) => {
  setTimeout(tryConnection, 1000);
});
