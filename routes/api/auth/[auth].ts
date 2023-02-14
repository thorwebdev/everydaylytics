import { Handlers } from "$fresh/server.ts";
import { createServerClient } from "../../../components/supabase.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const mode = ctx.params.auth;
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

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

    console.log("auth route headers");
    headers.forEach((v, k) => console.log(k, v));
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
