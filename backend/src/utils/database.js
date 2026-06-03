import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/db.json');

// Helper to atomically read JSON DB file
export async function readData() {
  try {
    const raw = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading JSON DB, restoring defaults:', error);
    // Return empty schema in case of error
    return {
      users: [],
      vessels: [],
      voyages: [],
      cospReports: [],
      noonReports: [],
      eospReports: [],
      alerts: [],
      performanceRecords: []
    };
  }
}

// Helper to atomically write JSON DB file
export async function writeData(data) {
  try {
    const formatted = JSON.stringify(data, null, 2);
    await fs.writeFile(dbPath, formatted, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to JSON DB:', error);
    return false;
  }
}
