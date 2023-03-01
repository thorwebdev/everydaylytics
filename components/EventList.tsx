import { Database } from "../types/database.types.ts";
import { Link } from "./Link.tsx";

interface EventListProps {
  events: Array<Database["public"]["Tables"]["events"]["Row"]> | null;
}

export function EventList(props: EventListProps) {
  return (
    <>
      {props.events?.map((event) => (
        <div key={event.id}>
          <Link href={`/events/${event.id}`}>{event.name}</Link>
        </div>
      ))}
    </>
  );
}
