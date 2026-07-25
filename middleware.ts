import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only guard the private area + auth pages. Public landing pages are untouched.
  matcher: ["/dashboard/:path*", "/login", "/forgot-password", "/reset-password"],
};
