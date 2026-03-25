// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   const supabaseResponse = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // Refresh session si expirée
//   await supabase.auth.getSession();

//   return supabaseResponse;
// }


import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// routes accessibles sans auth
const PUBLIC_ROUTES = ["/auth", "/auth/callback"];

// routes statiques à ignorer
const IGNORED_PREFIXES = ["/_next", "/favicon", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ignore static assets and auth api
  if (IGNORED_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  // not authenticated → redirect to auth
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    // preserve the intended destination for post-login redirect
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // authenticated + on auth page → redirect to dashboard
  if (user && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};