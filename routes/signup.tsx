import { Head } from "$fresh/runtime.ts";
import type { Handlers } from "$fresh/server.ts";
import SignUpOrIn from "../islands/SignUpOrIn.tsx";
import { Link } from "../components/Link.tsx";

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

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>EverydayLytics - Sign Up</title>
      </Head>
      <SignUpOrIn mode="signup" />
      <p>
        Already have an account? <Link href="/signin">Sign In</Link>
      </p>
    </>
  );
}
