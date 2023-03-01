import { PageProps } from "$fresh/server.ts";
import { Link } from "../../components/Link.tsx";
import type { Handlers } from "$fresh/server.ts";
import { createServerClient } from "../../utils/supabase.ts";
import { Database } from "../../types/database.types.ts";

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
    return ctx.render!({ event, error });
  },
};

interface PageData {
  event: Database["public"]["Tables"]["events"]["Row"] | null;
}

export default function EventPage(props: PageProps<PageData>) {
  return (
    <>
      <Link href="/">Back</Link>
      <div>Hello {props.params.id}</div>
      <pre>{JSON.stringify(props.data.event, null, 2)}</pre>
    </>
  );
}
