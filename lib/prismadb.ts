import { PrismaClient as PrismaClientSqlite } from '../generated/sqlite';
import { PrismaClient as PrismaClientSupabase } from '../generated/supabase';

// --- Cliente de SQLite ---
// Usado por el indexador para escritura rápida de datos crudos.
declare global {
  var sqlite: PrismaClientSqlite | undefined;
}

const sqliteDb = globalThis.sqlite || new PrismaClientSqlite();
if (process.env.NODE_ENV !== 'production') {
  globalThis.sqlite = sqliteDb;
}

// --- Cliente de Supabase ---
// Usado por el worker para escribir datos agregados (OHLC) y por la API para leerlos.
declare global {
  var supabase: PrismaClientSupabase | undefined;
}

const supabaseDb = globalThis.supabase || new PrismaClientSupabase();
if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabaseDb;
}

// Exportamos ambas instancias para que puedan ser usadas en la aplicación.
export { sqliteDb, supabaseDb };