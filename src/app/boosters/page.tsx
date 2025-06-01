import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { useCurrencyStore } from "@/store/currency";
import { toast } from "sonner";

interface Booster {
  id: string;
  name: string;
  description: string;
  price: number;
  cardCount: number;
  image: string;
  rarity: {
    common: number;
    uncommon: number;
    rare: number;
    legendary: number;
  };
}

const AVAILABLE_BOOSTERS: Booster[] = [
  {
    id: "starter-pack",
    name: "Pack de Démarrage",
    description: "Le pack parfait pour débuter votre collection",
    price: 500,
    cardCount: 10,
    image: "/boosters/starter.jpg",
    rarity: {
      common: 6,
      uncommon: 3,
      rare: 1,
      legendary: 0,
    },
  },
  {
    id: "premium-pack",
    name: "Pack Premium",
    description: "Garantie d'obtenir au moins une carte légendaire !",
    price: 1000,
    cardCount: 10,
    image: "/boosters/premium.jpg",
    rarity: {
      common: 4,
      uncommon: 3,
      rare: 2,
      legendary: 1,
    },
  },
];

export default function BoostersPage() {
  const removeDiamonds = useCurrencyStore((state) => state.removeDiamonds);

  const handlePurchase = (booster: Booster) => {
    const success = removeDiamonds(booster.price);
    if (success) {
      toast.success(`Vous avez acheté un ${booster.name} !`);
      // TODO: Implémenter l'ouverture du pack
    } else {
      toast.error("Vous n'avez pas assez de diamants !");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Packs & Boosters</h1>
          <CurrencyDisplay />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AVAILABLE_BOOSTERS.map((booster) => (
            <div
              key={booster.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all"
            >
              <div className="h-48 bg-gray-700">
                {/* Image placeholder - nous ajouterons les images plus tard */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Image du Pack
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{booster.name}</h2>
                <p className="text-gray-400 mb-4">{booster.description}</p>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Nombre de cartes :</span>
                    <span className="font-bold">{booster.cardCount}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Communes :</span>
                      <span>{booster.rarity.common}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Peu communes :</span>
                      <span>{booster.rarity.uncommon}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-400">
                      <span>Rares :</span>
                      <span>{booster.rarity.rare}</span>
                    </div>
                    <div className="flex justify-between text-sm text-purple-400">
                      <span>Légendaires :</span>
                      <span>{booster.rarity.legendary}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                      onClick={() => handlePurchase(booster)}
                    >
                      Acheter pour {booster.price} 💎
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
