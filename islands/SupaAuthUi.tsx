import { createBrowserClient } from "../components/supabase.ts";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

export default function AuthUi() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h2>Supabase Auth UI</h2>
      <div class="flex flex-col space-y-4">
        <>
          <p>This is the browser</p>
          <Auth
            // @ts-ignore: version mismatch, tracked here: https://github.com/supabase/auth-ui/issues/109
            supabaseClient={createBrowserClient()}
            providers={["github"]}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#404040",
                    brandAccent: "#52525b",
                  },
                },
              },
            }}
            theme="dark"
          />
        </>
      </div>
    </div>
  );
}
