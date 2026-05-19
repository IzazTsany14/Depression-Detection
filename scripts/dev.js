import { spawn, spawnSync } from 'child_process';
import net from 'net';

const BACKEND_PORT = Number(process.env.PORT || 5000);
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 5173);
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

const isPortOpen = (port) => new Promise((resolve) => {
  const socket = net.createConnection({ host: '127.0.0.1', port });

  socket.once('connect', () => {
    socket.destroy();
    resolve(true);
  });

  socket.once('error', () => {
    socket.destroy();
    resolve(false);
  });
});

const isBackendHealthy = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

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

const processes = [];

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

const backendAlreadyRunning = await isPortOpen(BACKEND_PORT);

if (backendAlreadyRunning) {
  const healthy = await isBackendHealthy();

  if (!healthy) {
    console.error(`Port ${BACKEND_PORT} sudah dipakai, tapi backend tidak merespons ${BACKEND_URL}/api/health.`);
    console.error('Tutup proses yang memakai port 5000 dulu, lalu jalankan npm run dev lagi.');
    process.exit(1);
  }

  console.log(`Backend sudah berjalan di ${BACKEND_URL}.`);
} else {
  processes.push(runCommand('npm --prefix backend start'));
}

processes.push(runCommand(`npm run dev:frontend -- --host 127.0.0.1 --port ${FRONTEND_PORT}`));

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown(code || 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
