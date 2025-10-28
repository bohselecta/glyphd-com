import fs from 'fs';
import path from 'path'

export function loadKeysIntoEnv() {
  try {
    // Try local keys file (for development)
    const p = path.join(process.cwd(), 'keys', 'keys.json');
    if (fs.existsSync(p)) {
      const o = JSON.parse(fs.readFileSync(p, 'utf-8'));
      for (const [k, v] of Object.entries(o || {})) {
        if (!process.env[k]) process.env[k] = String(v);
      }
    }
    
    // Log which keys are available (for debugging)
    console.log('API Keys loaded:', {
      hasImageKey: !!process.env.IMAGE_GEN_API_KEY,
      hasZaiKey: !!process.env.ZAI_API_KEY
    });
  } catch (err) {
    console.error('Failed to load keys:', err);
  }
}

