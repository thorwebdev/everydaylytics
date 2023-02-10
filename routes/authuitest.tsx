import { Head } from "$fresh/runtime.ts";
import AuthUi from "../islands/SupaAuthUi.tsx";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>EverydayLytics - Auth UI Test</title>
      </Head>
      <AuthUi />
    </>
  );
}
