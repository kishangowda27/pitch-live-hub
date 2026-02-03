import { createClient } from '@insforge/sdk';

// TODO: move these to environment variables (e.g. Vite env)
const INSFORGE_BASE_URL = 'https://ucu4jcd5.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;

export const insforge = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

