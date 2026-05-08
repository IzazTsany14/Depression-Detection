import { spawn, spawnSync } from 'child_process';

const runCommand = (command) => {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', command], {
      stdio: 'inherit',
      shell: false
    });
  }

  return spawn(command, {
    stdio: 'inherit',
    shell: true
  });
};

const processes = [
  runCommand('npm --prefix backend start'),
  runCommand('npm run dev:frontend -- --host 127.0.0.1 --port 5173')
];

let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
          stdio: 'ignore'
        });
      } else {
        child.kill();
      }
    }
  }

  process.exit(exitCode);
};

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown(code || 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
