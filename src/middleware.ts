import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type NextRequestWithAuth = NextRequest & {
  auth: {
    userId: string;
    user: {
      email: string;
      // autres propriétés...
    }
  }
}

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

interface CookieMethods {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
  getAll: () => { name: string; value: string }[];
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            ...options,
            name,
            value,
          });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            ...options,
            name,
            value: "",
          });
        },
        getAll() {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
      } as CookieMethods,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && request.nextUrl.pathname.startsWith("/collection")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page d'auth
  if (session && request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/collection", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/collection/:path*", "/auth"],
};
