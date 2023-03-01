import { Button } from "../components/Button.tsx";

export default function EventForm() {
  return (
    <form method="post">
      <label>
        name: <input required type="text" name="name" />
      </label>
      <label>
        default duration (mins):{" "}
        <input required type="number" name="duration" value={0} />
      </label>
      <Button>Save</Button>
    </form>
  );
}
