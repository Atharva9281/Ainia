import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a safe fallback client when env vars are missing so the app doesn't crash
function createDisabledAuthClient() {
  // Minimal shape needed by our auth helpers
  const noopSubscription = { unsubscribe: () => {} }
  return {
    auth: {
      async signInWithOAuth() {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      },
      async signOut() {
        return { error: null }
      },
      async getUser() {
        return { data: { user: null }, error: null }
      },
      onAuthStateChange(callback: (event: unknown, session: unknown) => void) {
        // Immediately provide a null session and return an unsubscribe handle
        try { callback('INITIAL', null) } catch {}
        return { data: { subscription: noopSubscription } }
      },
    },
  } as any
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (() => {
      console.warn('Supabase env vars missing; running with auth disabled.')
      return createDisabledAuthClient()
    })()

// For admin operations (using service role key)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase // Fallback to regular client if no service key
