import { Button } from "../components/Button.tsx";

export default function LogForm({ duration }: { duration: number }) {
  return (
    <form method="post">
      <label>
        duration (mins):{" "}
        <input required type="number" name="duration" value={duration} />
      </label>
      <Button>Log</Button>
    </form>
  );
}
