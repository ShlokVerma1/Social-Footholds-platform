import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Regular authenticated client
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore error
          }
        },
      },
      auth: {
        persistSession: false,
      }
    }
  )
}

// Admin client using service role to bypass RLS when needed (e.g., fulfilling orders)
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    }
  )
}

// Re-usable auth verifier
export async function authenticate() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  return { supabase, user }
}

export async function authenticateAdmin() {
  const { supabase, user } = await authenticate()

  // Verify admin role via profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden')
  }

  // Return the service_role client as 'supabase' so admin endpoints bypass RLS
  const adminClient = createAdminClient()
  return { supabase: adminClient, user, normalClient: supabase }
}
