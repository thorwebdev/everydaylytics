import { Handlers } from "$fresh/server.ts";
import { createServerClient } from "../../../utils/supabase.ts";
import { Provider } from "@supabase/supabase-js";

export const handler: Handlers = {
  async POST(req, ctx) {
    const mode = ctx.params.auth;
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const provider = form.get("provider") as Provider;

    const headers = new Headers();
    try {
      const supabase = createServerClient({
        req,
        resHeaders: headers,
        cookieOptions: { domain: url.hostname },
      });

      switch (mode) {
        case "signup":
          {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            headers.set(
              "location",
              `/`,
            );
          }
          break;

        case "signin":
          {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) throw error;
            headers.set(
              "location",
              `/`,
            );
          }
          break;

        case "oauth":
          {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider,
              options: {
                scopes: "repo",
                redirectTo: `${new URL(req.url).protocol}//${
                  new URL(req.url).host
                }/supa-oauth-redirect-return`,
              },
            });
            if (error) throw error;
            headers.set(
              "location",
              data.url,
            );
          }
          break;

        case "signout":
          {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            headers.set(
              "location",
              `/`,
            );
          }
          break;

        default: {
          headers.set(
            "location",
            `/signup?error=${encodeURIComponent("unknown error")}`,
          );
        }
      }
    } catch (e) {
      headers.set(
        "location",
        `/signup?error=${encodeURIComponent(e.message)}`,
      );
    }

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
