import {
  CookieOptions,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-shared";
import { deleteCookie, getCookies, setCookie } from "std/http/cookie.ts";
import { Database } from "../types/database.types.ts";

import { GoTrueClient } from "../supabase/gotrue-js/src/index.ts";

export function createPKCEGotrueClient({ req, resHeaders, cookieOptions }: {
  req: Request;
  resHeaders: Headers;
  cookieOptions?: CookieOptions;
}) {
  return new GoTrueClient({
    url: "http://localhost:9999",
    storage: {
      getItem: (name) => {
        console.log("getItem: ", name);
        const cookies = getCookies(req.headers);
        const cookie = cookies[name] ?? "";
        const value = decodeURIComponent(cookie);
        console.log(value);
        return value;
      },
      setItem: (name, value) => {
        console.log("setItem: ", name, value);
        setCookie(resHeaders, {
          name,
          value: encodeURIComponent(value),
          ...cookieOptions,
          sameSite: "Lax",
          httpOnly: true,
        });
      },
      removeItem: (name) => {
        console.log("removeItem: ", name);
        deleteCookie(resHeaders, name, {
          ...cookieOptions,
        });
      },
    },
  });
}

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
      const cookies = getCookies(req.headers);
      const cookie = cookies[name] ?? "";
      return decodeURIComponent(cookie);
    },
    setCookie: (name, value, options) => {
      setCookie(resHeaders, {
        name,
        value: encodeURIComponent(value),
        ...options,
        sameSite: "Lax",
        httpOnly: false,
      });
    },
  });
}
