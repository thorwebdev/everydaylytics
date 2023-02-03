import { Head } from "$fresh/runtime.ts";
import SignUpOrIn from "../islands/SignUpOrIn.tsx";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>EverydayLytics - Sign In</title>
      </Head>
      <SignUpOrIn mode="signin" />
      <p>
        Don't have an account yet? <a href="/signup">Sign Up</a>
      </p>
    </>
  );
}
