import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/orders']
const protectedPrefixes = ['/services/', '/payment/']

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session cookie on every request
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if route requires authentication
  const isProtectedRoute =
    protectedRoutes.includes(pathname) ||
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  // Check if route is an admin route (but not /admin itself)
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/orders',
    '/admin/enquiries',
    '/admin/blogs',
    '/admin/services'
  ];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && !user) {
    const adminLoginUrl = request.nextUrl.clone()
    adminLoginUrl.pathname = '/admin'
    return NextResponse.redirect(adminLoginUrl)
  }

  if (isAdminRoute && user) {
    // Use the existing authenticated supabase client (which already holds the user's
    // session cookie) to query the profiles table. We do NOT create a new serviceClient
    // here because SUPABASE_SERVICE_ROLE_KEY is unavailable in the Next.js Edge Runtime —
    // only NEXT_PUBLIC_* variables are accessible in middleware. The authenticated session
    // on the existing client is sufficient: Supabase RLS allows users to read their own row.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const homeUrl = request.nextUrl.clone()
      homeUrl.pathname = '/'
      return NextResponse.redirect(homeUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard',
    '/orders',
    '/services/:path*',
    '/payment/:path*',
    '/admin/:path*',
  ],
}
