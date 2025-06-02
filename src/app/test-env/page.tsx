export default function TestEnv() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Test des Variables d'Environnement
      </h1>
      <pre className="bg-gray-100 p-4 rounded">
        SUPABASE_URL:{" "}
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Défini" : "❌ Non défini"}
        {"\n"}
        SUPABASE_KEY:{" "}
        {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "✅ Défini"
          : "❌ Non défini"}
      </pre>
      <p>Voici l&apos;environnement actuel :</p>
    </div>
  );
}
