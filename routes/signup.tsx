import { Head } from "$fresh/runtime.ts";
import SignUpOrIn from "../islands/SignUpOrIn.tsx";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>EverydayLytics - Sign Up</title>
      </Head>
      <SignUpOrIn mode="signup" />
      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </>
  );
}
