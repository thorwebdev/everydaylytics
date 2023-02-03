import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { createServerClient } from "../components/supabase.ts";
import { Session } from "@supabase/supabase-js";
import SignOut from "../islands/SignOut.tsx";
import { Link } from "../components/Link.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const headers = new Headers();
    const supabase = createServerClient({ req, resHeaders: headers });
    const { data: { session } } = await supabase.auth.getSession();
    return ctx.render!({ session, headers });
  },
};

interface PageData {
  session: Session | null;
}

export default function Home({ data }: PageProps<PageData>) {
  return (
    <>
      <Head>
        <title>EverydayLytics - Home</title>
      </Head>
      {data.session ? <SignOut /> : (
        <>
          <Link href="/signup">Get started</Link>
          <Link href="/signin">Sign In</Link>
        </>
      )}
      <div class="p-4 mx-auto max-w-screen-md">
        <pre>{JSON.stringify(data.session, null, 2)}</pre>
      </div>
    </>
  );
}
