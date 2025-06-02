import { supabase } from "@/lib/supabase";

interface TestData {
  id: string;
  // autres champs de votre table test...
}

export default async function TestConnection() {
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .returns<TestData[]>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test de Connexion Supabase</h1>
      {data ? (
        <div className="text-green-500">
          Connexion réussie ! La table test existe.
          <p>Nombre d&apos;enregistrements : {data.length}</p>
        </div>
      ) : (
        <div className="text-red-500">
          Erreur de connexion : {error?.message}
        </div>
      )}
    </div>
  );
}
