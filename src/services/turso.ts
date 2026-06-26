import { createClient, Client } from '@libsql/client';

let client: Client | null = null;

export const getTursoClient = (): Client => {
  if (client) return client;

  const url = import.meta.env.VITE_TURSO_DATABASE_URL;
  const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  console.log('[Turso] Connecting to:', url ? url.substring(0, 40) + '...' : 'MISSING');

  if (!url) {
    throw new Error('VITE_TURSO_DATABASE_URL no configurado');
  }

  client = createClient({
    url,
    authToken: authToken || undefined,
  });

  return client;
};

export const initDatabase = async (): Promise<void> => {
  try {
    const c = getTursoClient();
    await c.execute('SELECT 1 as ok');
    console.log('[Turso] Connected OK');
  } catch (error: any) {
    console.error('[Turso] Connection error:', error.message || error);
    throw error;
  }
};

export default getTursoClient;
