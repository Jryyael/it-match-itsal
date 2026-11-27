import { createClient } from '@supabase/supabase-js';

export const DB_CONFIG_STORAGE_KEY = 'sibap_itsal_db_config_v1';

let cachedClient = null;
let cachedSignature = '';

/**
 * Lee las credenciales de Supabase desde variables de entorno Vite
 * o, en su defecto, desde la configuración guardada en el panel SGC.
 */
export function getSupabaseConfig() {
  const envUrl = (import.meta?.env?.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const envKey = (import.meta?.env?.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, isConfigured: true };
  }

  try {
    const raw = localStorage.getItem(DB_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const customUrl = (parsed?.supabaseUrl || '').trim().replace(/\/+$/, '');
      const customKey = (parsed?.supabaseKey || '').trim();
      if (customUrl && customKey) {
        return { url: customUrl, anonKey: customKey, isConfigured: true };
      }
    }
  } catch {
    // Silencioso en entornos sin localStorage o JSON inválido
  }

  return { url: '', anonKey: '', isConfigured: false };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().isConfigured;
}

/**
 * Retorna una instancia segura del cliente @supabase/supabase-js o null si faltan credenciales.
 */
export function getSupabaseClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const signature = `${url}::${anonKey}`;
  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedSignature = signature;
    return cachedClient;
  } catch {
    return null;
  }
}

export const supabase = getSupabaseClient();
