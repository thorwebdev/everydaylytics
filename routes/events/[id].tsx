import { PageProps } from "$fresh/server.ts";
import { Link } from "../../components/Link.tsx";
import type { Handlers } from "$fresh/server.ts";
import { createServerClient } from "../../utils/supabase.ts";
import { Database } from "../../types/database.types.ts";
import LogForm from "../../islands/LogForm.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    if (!ctx.state.session) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
    // Get event from DB
    const supabase = createServerClient({ req });
    const { data: event, error } = await supabase.from("events").select("*").eq(
      "id",
      ctx.params.id,
    ).single();
    if (!event) {
      const headers = new Headers();
      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
    // Get log count from DB
    const { count } = await supabase.from("logs").select("*", {
      count: "estimated",
      head: true,
    }).eq("event_id", ctx.params.id);

    return ctx.render!({ event, error, count: count ?? 0 });
  },
  // Logform submit handler
  async POST(req, ctx) {
    const form = await req.formData();
    const duration = Number(form.get("duration") as string);
    const supabase = createServerClient({ req });
    const { error } = await supabase.from("logs").insert({
      event_id: ctx.params.id,
      duration,
    });
    if (error) throw error;

    // TODO: is this a good approach to retrigger the GET handler?
    const headers = new Headers();
    headers.set("location", req.url);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

interface PageData {
  event: Database["public"]["Tables"]["events"]["Row"];
  count: number;
  error: { message: string } | null;
}

export default function EventPage(props: PageProps<PageData>) {
  const { data: { event, count } } = props;
  return (
    <>
      <Link href="/">Back</Link>
      <h1>{event.name}</h1>
      <LogForm duration={event.duration} />
      <p>Count: {count}</p>
    </>
  );
}
