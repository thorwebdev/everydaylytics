import { Button } from "../components/Button.tsx";

export default function SignUpOrIn({ mode }: { mode: "signup" | "signin" }) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h2>{mode === "signup" ? "Sign Up" : "Sign In"}</h2>
      <form method="post" action={`/api/auth/${mode}`}>
        <label>
          email: <input required type="email" name="email" />
        </label>
        <label>
          password: <input required type="password" name="password" />
        </label>
        <Button>{mode === "signup" ? "Sign Up" : "Sign In"}</Button>
      </form>
      <hr />
      <form method="post" action={`/api/auth/oauth`}>
        <input type="hidden" name="provider" value="github" />
        <Button>
          GitHub OAuth
        </Button>
      </form>
    </div>
  );
}
