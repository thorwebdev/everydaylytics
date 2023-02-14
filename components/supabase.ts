import {
  CookieOptions,
  createServerSupabaseClient,
  parseCookies,
  serializeCookie,
} from "@supabase/auth-helpers-shared";
import { Database } from "../types/database.types.ts";

export function createServerClient(
  { req, resHeaders, cookieOptions }: {
    req: Request;
    resHeaders: Headers;
    cookieOptions?: CookieOptions;
  },
) {
  return createServerSupabaseClient<Database>({
    cookieOptions,
    supabaseUrl: Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321",
    supabaseKey: Deno.env.get("SUPABASE_ANON_KEY") ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    getRequestHeader: (key) => {
      return req.headers.get(key) ?? undefined;
    },
    getCookie: (name) => {
      const result = parseCookies(req.headers.get("Cookie") ?? "")[name];
      return result;
    },
    setCookie: (name, value, options) => {
      const cookieStr = serializeCookie(name, value, {
        ...options,
        // Allow supabase-js on the client to read the cookie as well
        httpOnly: false,
      });
      resHeaders.set("set-cookie", cookieStr);
    },
  });
}
