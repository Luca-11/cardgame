"use client";

import { CardGrid } from "@/components/collection/CardGrid";
import type { Card } from "@/lib/supabase";
import { createBrowserClient } from "@supabase/ssr";

type CollectionClientProps = {
  initialCards: Card[];
  userEmail: string | undefined;
};

export function CollectionClient({
  initialCards,
  userEmail,
}: CollectionClientProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Ma Collection</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <CardGrid cards={initialCards} />
    </div>
  );
}
