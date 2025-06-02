import { supabase } from "@/lib/supabase";

export default async function TestConnection() {
  const { _data: data } = await supabase.from("test").select("*");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test de Connexion Supabase</h1>
      {data ? (
        <div className="text-green-500">
          Connexion réussie ! La table test existe.
        </div>
      ) : (
        <div className="text-red-500">
          Erreur de connexion : {data}
        </div>
      )}
    </div>
  );
}
