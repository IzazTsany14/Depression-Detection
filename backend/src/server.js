/**
 * Server Entry Point
 * Menjalankan Express app di port yang ditentukan
 */
import app from './app.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Depression Detection API Server');
  console.log('='.repeat(50));
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log(`✓ Port: ${PORT}`);
  console.log(`✓ URL: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
});

/**
 * Graceful Shutdown
 * Handle server termination dengan baik
 */
process.on('SIGTERM', () => {
  console.log('\n📥 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📥 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
