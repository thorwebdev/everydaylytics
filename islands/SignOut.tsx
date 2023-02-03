import { Button } from "../components/Button.tsx";

export default function SignOut() {
  return (
    <form method="post" action="/api/auth/signout">
      <Button>Sign Out</Button>
    </form>
  );
}
