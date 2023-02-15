import { MiddlewareHandler } from "$fresh/server.ts";
import { createServerClient } from "../utils/supabase.ts";

export const handler: MiddlewareHandler[] = [
  async function getSupabaseSession(req, ctx) {
    const { pathname } = new URL(req.url);
    if (
      pathname.includes("api/auth/signout") || pathname.includes("_frsh") ||
      pathname.includes(".ico")
    ) {
      return ctx.next();
    }
    const headers = new Headers();
    const supabase = createServerClient({ req, resHeaders: headers });
    const { data: { session } } = await supabase.auth.getSession();
    ctx.state.session = session;
    const res = await ctx.next();
    headers.forEach((v, k) => res.headers.set(k, v));
    return res;
  },
];
