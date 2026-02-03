import { createClient } from '@insforge/sdk';

const INSFORGE_BASE_URL = 'https://ucu4jcd5.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;

// Debug logging for production
if (!INSFORGE_ANON_KEY) {
  console.error('❌ VITE_INSFORGE_ANON_KEY is not set');
} else {
  console.log('✅ InsForge client initialized');
}

export const insforge = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

