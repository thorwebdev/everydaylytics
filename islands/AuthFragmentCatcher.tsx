import { useEffect } from "preact/hooks";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-shared";

interface SupaClientProps {
  supabaseUrl: string;
  supabaseKey: string;
}

export default function AuthFragmentCatcher(props: SupaClientProps) {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient({ ...props });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) location.reload();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <span></span>;
}
