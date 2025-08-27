import { type NextRequest, NextResponse } from "next/server"

// Configuration
const CONFIG = {
  ROUTES: {
    USER_AUTH: ["/login", "/signup", "/forgot-password"],
    ADMIN_AUTH: ["/admin/login"],
    USER_PROTECTED: ["/profile", "/dashboard", "/orders", "/settings"],
    ADMIN_PROTECTED: [
      "/admin/products/create",
      "/admin/users/create",
      "/admin/dashboard",
      "/admin/products",
      "/admin/profile",
      "/admin/users",
    ],
    PUBLIC: ["/", "/about", "/contact", "/sports-retail"],
  },
  COOKIES: {
    USER_TOKEN: "equiwings-customer-token",
    ADMIN_TOKEN: "equiwings-admin-token"
  },
  REDIRECTS: {
    USER_DASHBOARD: "/sports-retail",
    ADMIN_DASHBOARD: "/admin/dashboard",
    USER_LOGIN: "/login",
    ADMIN_LOGIN: "/admin/login",
    HOME: "/",
  },
} as const

type RouteType = "user-auth" | "admin-auth" | "user-protected" | "admin-protected" | "public" | "unknown"

interface AuthState {
  isUserAuth: boolean
  isAdminAuth: boolean
}

// Token validation
function validateToken(token: string | undefined): boolean {
  if (!token?.trim()) return false

  try {
    if (token.includes(".")) {
      const parts = token.split(".")
      if (parts.length !== 3) return false

      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)

      return payload.exp && payload.iat && payload.exp > now && payload.iat <= now
    }

    return token.length >= 32
  } catch {
    return false
  }
}

// Route matching
const matchesRoutes = (routes: readonly string[], pathname: string): boolean =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

const getRouteType = (pathname: string): RouteType => {
  if (matchesRoutes(CONFIG.ROUTES.USER_AUTH, pathname)) return "user-auth"
  if (matchesRoutes(CONFIG.ROUTES.ADMIN_AUTH, pathname)) return "admin-auth"
  if (matchesRoutes(CONFIG.ROUTES.USER_PROTECTED, pathname)) return "user-protected"
  if (matchesRoutes(CONFIG.ROUTES.ADMIN_PROTECTED, pathname)) return "admin-protected"
  if (matchesRoutes(CONFIG.ROUTES.PUBLIC, pathname)) return "public"
  return "unknown"
}

// Authentication state
const getAuthState = (request: NextRequest): AuthState => ({
  isUserAuth: validateToken(request.cookies.get(CONFIG.COOKIES.USER_TOKEN)?.value),
  isAdminAuth: validateToken(request.cookies.get(CONFIG.COOKIES.ADMIN_TOKEN)?.value),
})

// Route handlers with role-based access control
const handleUserAuth = (auth: AuthState, url: string): NextResponse => {
  // If user is already logged in and trying to access user auth pages - block them
  if (auth.isUserAuth) {
    return NextResponse.redirect(new URL(CONFIG.REDIRECTS.USER_DASHBOARD, url))
  }

  // If admin is logged in and trying to access user auth pages - allow them
  // No additional check needed, just allow access
  return NextResponse.next()
}

const handleAdminAuth = (auth: AuthState, url: string): NextResponse => {
  // If admin is already logged in and trying to access admin auth pages - block them
  if (auth.isAdminAuth) {
    return NextResponse.redirect(new URL(CONFIG.REDIRECTS.ADMIN_DASHBOARD, url))
  }

  // If user is logged in and trying to access admin auth pages - allow them
  // No additional check needed, just allow access
  return NextResponse.next()
}

const handleUserProtected = (auth: AuthState, url: string): NextResponse => {
  // Only users can access user protected routes
  if (auth.isUserAuth) {
    return NextResponse.next()
  }

  // If admin is trying to access user protected routes, redirect to admin dashboard
  if (auth.isAdminAuth) {
    return NextResponse.redirect(new URL(CONFIG.REDIRECTS.ADMIN_DASHBOARD, url))
  }

  // No authentication, redirect to user login
  return NextResponse.redirect(new URL(CONFIG.REDIRECTS.USER_LOGIN, url))
}

const handleAdminProtected = (auth: AuthState, url: string): NextResponse => {
  // Only admins can access admin protected routes
  if (auth.isAdminAuth) {
    return NextResponse.next()
  }

  // If user is trying to access admin protected routes, redirect to user dashboard
  if (auth.isUserAuth) {
    return NextResponse.redirect(new URL(CONFIG.REDIRECTS.USER_DASHBOARD, url))
  }

  // No authentication, redirect to admin login
  return NextResponse.redirect(new URL(CONFIG.REDIRECTS.ADMIN_LOGIN, url))
}

const handlePublic = (): NextResponse => NextResponse.next()

const handleUnknown = (): NextResponse => NextResponse.next()

// Main middleware
export function middleware(request: NextRequest) {
  try {
    const { pathname, href } = request.nextUrl
    const authState = getAuthState(request)
    const routeType = getRouteType(pathname)

    // Debug logging (remove in production)
    // console.log(`[RBAC Middleware] Path: ${pathname}, User: ${authState.isUserAuth}, Admin: ${authState.isAdminAuth}, Route: ${routeType}`)

    switch (routeType) {
      case "user-auth":
        return handleUserAuth(authState, href)
      case "admin-auth":
        return handleAdminAuth(authState, href)
      case "user-protected":
        return handleUserProtected(authState, href)
      case "admin-protected":
        return handleAdminProtected(authState, href)
      case "public":
        return handlePublic()
      default:
        return handleUnknown()
    }
  } catch (error) {
    console.error('[RBAC Middleware] Error:', error)

    if (error instanceof Response) {
      return error
    } else if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
}