import { supabase } from './supabase'
import type { User } from './types'

// Sign in with Google OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
  
  if (error) {
    console.error('Error signing in with Google:', error.message)
    throw error
  }
  
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error.message)
    return null
  }
  
  return user ? {
    id: user.id,
    email: user.email || '',
    user_metadata: user.user_metadata
  } : null
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ? {
      id: session.user.id,
      email: session.user.email || '',
      user_metadata: session.user.user_metadata
    } : null
    
    callback(user)
  })
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}
