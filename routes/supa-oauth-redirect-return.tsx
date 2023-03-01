import type { Handlers } from "$fresh/server.ts";
import AuthFragmentCatcher from "../islands/AuthFragmentCatcher.tsx";

export const handler: Handlers = {
  GET(_req, ctx) {
    if (ctx.state.session) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
    return ctx.render!();
  },
};

export default function RedirectReturn() {
  return (
    <div>
      <AuthFragmentCatcher
        supabaseUrl={Deno.env.get("SUPABASE_URL")!}
        supabaseKey={Deno.env.get("SUPABASE_ANON_KEY")!}
        cookieOptions={{
          name: `sb-${
            new URL(Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321")
              .hostname.split(".")[0]
          }-auth-token`,
        }}
      />
    </div>
  );
}
