import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(configDir, '../../../.env');
const backendEnvPath = path.resolve(configDir, '../../.env');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: backendEnvPath });
