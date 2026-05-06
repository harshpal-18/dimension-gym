import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'db.json');

const defaultData = {
  users: [],
  payments: [],
  bookings: [],
};

let db;

export async function initDB() {
  const { mkdirSync } = await import('fs');
  try {
    mkdirSync(join(__dirname, '..', 'data'), { recursive: true });
  } catch { /* dir exists */ }

  const adapter = new JSONFile(dbPath);
  db = new Low(adapter, defaultData);
  await db.read();

  // Ensure defaults
  db.data ||= defaultData;
  db.data.users ||= [];
  db.data.payments ||= [];
  db.data.bookings ||= [];

  await db.write();
  console.log('✅ Database initialized (JSON file)');
}

export function getDB() {
  return db;
}

export async function saveDB() {
  await db.write();
}