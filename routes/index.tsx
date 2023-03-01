import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { createServerClient } from "../utils/supabase.ts";
import { Session } from "@supabase/supabase-js";
import SignOut from "../islands/SignOut.tsx";
import { Link } from "../components/Link.tsx";
import { Database } from "../types/database.types.ts";
import EventForm from "../islands/EventForm.tsx";
import { EventList } from "../components/EventList.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const supabase = createServerClient({ req });
    const { data: events } = await supabase.from("events").select("*");
    return ctx.render!({ events, session: ctx.state.session as Session });
  },
  // New event form submit
  async POST(req, ctx) {
    const form = await req.formData();
    const name = form.get("name") as string;
    const duration = Number(form.get("duration") as string);

    const supabase = createServerClient({ req });
    const { error } = await supabase.from("events").insert({
      name,
      duration,
    });
    const { data: events } = await supabase.from("events").select("*");
    return ctx.render!({
      events,
      session: ctx.state.session as Session,
      error,
    });
  },
};

interface PageData {
  session: Session | null;
  events: Array<Database["public"]["Tables"]["events"]["Row"]> | null;
  error: { message: string } | null;
}

export default function Home({ data }: PageProps<PageData>) {
  return (
    <>
      <Head>
        <title>EverydayLytics - Home</title>
      </Head>

      <div class="p-4 mx-auto max-w-screen-md">
        {data.session
          ? (
            <>
              <SignOut />
              <h3>Welcome {data.session.user.email}</h3>
              <EventForm />
              <EventList events={data.events} />
            </>
          )
          : (
            <>
              <Link href="/signup">Get started</Link>
              <Link href="/signin">Sign In</Link>
            </>
          )}
      </div>
    </>
  );
}
