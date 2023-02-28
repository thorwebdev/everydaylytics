import { Handlers } from "$fresh/server.ts";
import { createPKCEGotrueClient } from "../../../utils/supabase.ts";
import { Provider } from "@supabase/supabase-js";

export const handler: Handlers = {
  async GET(req) {
    const headers = new Headers();
    try {
      const url = new URL(req.url);
      const code = url.searchParams.get("code");
      if (!code) throw new Error("no code!");

      const auth = createPKCEGotrueClient({
        req,
        resHeaders: headers,
        cookieOptions: { domain: url.hostname },
      });
      console.log({ code });
      const { data, error } = await auth.exchangeAuthCode(code);
      console.log({ data, error });
      if (error) throw error;
      headers.set(
        "location",
        `/`,
      );
    } catch (e) {
      console.log(e.message);
      return new Response("no code!");
    }
    return new Response(null, {
      status: 303,
      headers,
    });
  },

  async POST(req, ctx) {
    const mode = ctx.params.auth;
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const provider = form.get("provider") as Provider;

    const headers = new Headers();
    try {
      const auth = createPKCEGotrueClient({
        req,
        resHeaders: headers,
        cookieOptions: { domain: url.hostname },
      });

      switch (mode) {
        case "oauth":
          {
            const { data, error } = await auth.signInWithOAuth({
              provider,
              options: {
                scopes: "repo",
                redirectTo: "http://localhost:8000/api/auth/callback",
                flowType: "pkce",
              },
            });
            console.log({ data, error });
            if (error) throw error;
            headers.set(
              "location",
              data.url,
            );
          }
          break;

        case "signup":
          {
            const { error } = await auth.signUp({ email, password });
            if (error) throw error;
            headers.set(
              "location",
              `/`,
            );
          }
          break;

        case "signin":
          {
            const { error } = await auth.signInWithPassword({
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
            const { error } = await auth.signOut();
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
