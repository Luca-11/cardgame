"use client";

import { CardGrid } from "@/components/collection/CardGrid";
import { useCardsStore } from "@/store/cards";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, ChangeEvent } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardRarity } from "@/types/cards";
import { Button } from "@/components/ui/button";

type CollectionClientProps = {
  userEmail: string | undefined;
};

interface CardWithCount extends Card {
  count: number;
}

interface Filters {
  search: string;
  rarity: CardRarity | "all";
  minAttack: number;
  minDefense: number;
  minMana: number;
}

const RARITIES: CardRarity[] = ["common", "uncommon", "rare", "legendary"];

export function CollectionClient({ userEmail }: CollectionClientProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { collection, fetchCollection, isLoading } = useCardsStore();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    rarity: "all",
    minAttack: 0,
    minDefense: 0,
    minMana: 0,
  });

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  // Filtrer les cartes
  const filteredCards = collection.filter((card) => {
    if (
      filters.search &&
      !card.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.rarity !== "all" && card.rarity !== filters.rarity) {
      return false;
    }
    if (card.attack < filters.minAttack) {
      return false;
    }
    if (card.defense < filters.minDefense) {
      return false;
    }
    if (card.mana < filters.minMana) {
      return false;
    }
    return true;
  });

  // Regrouper les cartes identiques et compter leur occurrence
  const groupedCards = filteredCards.reduce<CardWithCount[]>((acc, card) => {
    const existingCard = acc.find(
      (c) =>
        c.name === card.name &&
        c.rarity === card.rarity &&
        c.attack === card.attack &&
        c.defense === card.defense &&
        c.mana === card.mana
    );

    if (existingCard) {
      existingCard.count++;
    } else {
      acc.push({ ...card, count: 1 });
    }

    return acc;
  }, []);

  const resetFilters = () => {
    setFilters({
      search: "",
      rarity: "all",
      minAttack: 0,
      minDefense: 0,
      minMana: 0,
    });
  };

  return (
    <PageContainer>
      <div className="text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Ma Collection</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Chargement de votre collection...</p>
          </div>
        ) : groupedCards.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl mb-4">Votre collection est vide</h2>
            <p className="text-gray-400 mb-8">
              Commencez votre collection en ouvrant des packs de cartes !
            </p>
            <a
              href="/boosters"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Ouvrir des Packs
            </a>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    placeholder="Nom de la carte..."
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Rareté
                  </label>
                  <select
                    value={filters.rarity}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFilters({
                        ...filters,
                        rarity: e.target.value as CardRarity | "all",
                      })
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2"
                  >
                    <option value="all">Toutes</option>
                    {RARITIES.map((rarity) => (
                      <option key={rarity} value={rarity}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Attaque min.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minAttack}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFilters({
                        ...filters,
                        minAttack: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Défense min.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minDefense}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFilters({
                        ...filters,
                        minDefense: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Mana min.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minMana}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFilters({
                        ...filters,
                        minMana: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-4 text-gray-400">
              {collection.length} cartes au total ({groupedCards.length} cartes
              uniques)
            </div>
            <CardGrid cards={groupedCards} />
          </>
        )}
      </div>
    </PageContainer>
  );
}
