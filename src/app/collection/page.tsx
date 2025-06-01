import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CollectionClient } from "./client";

export default async function CollectionPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .order("name");
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null; // Le middleware redirigera vers /auth
  }

  return (
    <CollectionClient
      initialCards={cards || []}
      userEmail={session.user.email}
    />
  );
}
