import { Head } from "$fresh/runtime.ts";
import type { Handlers } from "$fresh/server.ts";
import SignUpOrIn from "../islands/SignUpOrIn.tsx";

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

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>EverydayLytics - Sign In</title>
      </Head>
      <SignUpOrIn mode="signin" />
      <p>
        Don't have an account yet? <a href="/signup">Sign Up</a>
      </p>
    </>
  );
}
