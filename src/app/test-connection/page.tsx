import { supabase } from "@/lib/supabase";

export default async function TestConnection() {
  const { data, error } = await supabase.from("cards").select("count");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test de Connexion Supabase</h1>
      {error ? (
        <div className="text-red-500">
          Erreur de connexion : {error.message}
        </div>
      ) : (
        <div className="text-green-500">
          Connexion réussie ! La table cards existe.
        </div>
      )}
    </div>
  );
}
