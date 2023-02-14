import { MiddlewareHandler } from "$fresh/server.ts";
import { createServerClient } from "../components/supabase.ts";

export const handler: MiddlewareHandler[] = [
  async function getSupabaseSession(req, ctx) {
    const { pathname } = new URL(req.url);
    if (pathname.includes("_frsh") || pathname.includes(".ico")) {
      return ctx.next();
    }
    console.log({ pathname });
    ctx.state.test = "test"; // this entry is attached
    const headers = new Headers();
    const supabase = createServerClient({ req, resHeaders: headers });
    const { data: { session } } = await supabase.auth.getSession();
    console.log({ session });
    ctx.state.session = session; // this entry is not attached
    const res = await ctx.next();
    const setCookieHeader = headers.get("set-cookie");
    console.log("middleware set-cookie", setCookieHeader);
    if (setCookieHeader) {
      res.headers.append("set-cookie", setCookieHeader);
    }
    return res;
  },
];
