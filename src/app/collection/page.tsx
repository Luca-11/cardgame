import { CollectionClient } from "./client";
import { supabase } from "@/lib/supabase";

export default async function CollectionPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <CollectionClient userEmail={user?.email} />;
}
