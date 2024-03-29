import {
  CookieAuthStorageAdapter,
  CookieOptions,
  CookieOptionsWithName,
  createSupabaseClient,
  DEFAULT_COOKIE_OPTIONS,
  SupabaseClientOptionsWithoutAuth,
} from "@supabase/auth-helpers-shared";
import { deleteCookie, getCookies, setCookie } from "std/http/cookie.ts";
import { Database } from "../types/database.types.ts";

class DenoFreshServerComponentAuthStorageAdapter
  extends CookieAuthStorageAdapter {
  constructor(
    private readonly context: {
      req: Request;
      resHeaders?: Headers;
    },
    cookieOptions?: CookieOptions,
  ) {
    super(cookieOptions);
  }

  protected getCookie(name: string): string | null | undefined {
    const cookies = getCookies(this.context.req.headers);
    const cookie = cookies[name] ?? "";
    return decodeURIComponent(cookie);
  }
  protected setCookie(name: string, value: string): void {
    if (!this.context.resHeaders) return;
    setCookie(this.context.resHeaders, {
      name,
      value: encodeURIComponent(value),
      ...this.cookieOptions,
      sameSite: "Lax",
      httpOnly: false,
    });
  }
  protected deleteCookie(name: string): void {
    if (!this.context.resHeaders) return;
    deleteCookie(this.context.resHeaders, name, { ...this.cookieOptions });
  }
}

export function createServerClient(
  context: {
    req: Request;
    resHeaders?: Headers;
  },
  {
    supabaseUrl = Deno.env.get("SUPABASE_URL"),
    supabaseKey = Deno.env.get("SUPABASE_ANON_KEY"),
    options,
    cookieOptions,
  }: {
    supabaseUrl?: string;
    supabaseKey?: string;
    options?: SupabaseClientOptionsWithoutAuth<"public">;
    cookieOptions?: CookieOptionsWithName;
  } = {},
) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either SUPABASE_URL and SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!",
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `DENO_FRESH@0.0.1`,
      },
    },
    auth: {
      storageKey: cookieOptions?.name,
      storage: new DenoFreshServerComponentAuthStorageAdapter(context, {
        ...DEFAULT_COOKIE_OPTIONS,
        ...cookieOptions,
      }),
    },
  });
}
