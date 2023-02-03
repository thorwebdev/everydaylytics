import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { createServerClient } from "../components/supabase.ts";
import { Session } from "@supabase/supabase-js";
import SignOut from "../islands/SignOut.tsx";
import { Link } from "../components/Link.tsx";
import { Database } from "../types/database.types.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const headers = new Headers();
    const supabase = createServerClient({ req, resHeaders: headers });
    const { data: { session } } = await supabase.auth.getSession();
    const { data: events } = await supabase.from("events").select("*");
    return ctx.render!({ session, events });
  },
};

interface PageData {
  session: Session | null;
  events: Array<Database["public"]["Tables"]["events"]["Row"]> | null;
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
        <pre>{JSON.stringify(data.events, null, 2)}</pre>
      </div>
    </>
  );
}
