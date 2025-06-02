"use client";

import { CardGrid } from "@/components/collection/CardGrid";
import { useCardsStore } from "@/store/cards";
import { useEffect, useState, ChangeEvent } from "react";
import { Card, CardRarity } from "@/types/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

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

const RARITY_COLORS = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  legendary: "text-purple-400",
};

export function CollectionClient({ userEmail }: CollectionClientProps) {
  const { collection, fetchCollection, isLoading } = useCardsStore();
  const [showFilters, setShowFilters] = useState(false);
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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Ma Collection
              </h1>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Masquer les filtres</span>
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4" />
                    <span>Filtrer</span>
                  </>
                )}
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Rechercher
                      </label>
                      <Input
                        type="text"
                        value={filters.search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFilters({ ...filters, search: e.target.value })
                        }
                        placeholder="Nom de la carte..."
                        className="bg-black/30 border-purple-900/20 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        className="w-full bg-black/30 border border-purple-900/20 rounded-md p-2 text-white focus:border-purple-500"
                      >
                        <option value="all">Toutes</option>
                        {RARITIES.map((rarity) => (
                          <option
                            key={rarity}
                            value={rarity}
                            className={RARITY_COLORS[rarity]}
                          >
                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Attaque min.
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={filters.minAttack}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFilters({
                            ...filters,
                            minAttack: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-black/30 border-purple-900/20 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Défense min.
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={filters.minDefense}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFilters({
                            ...filters,
                            minDefense: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-black/30 border-purple-900/20 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Mana min.
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={filters.minMana}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFilters({
                            ...filters,
                            minMana: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-black/30 border-purple-900/20 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-gray-400 hover:text-white"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : groupedCards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-8 text-center border border-purple-900/20"
            >
              <SlidersHorizontal className="mx-auto h-12 w-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Collection vide
              </h2>
              <p className="text-gray-400 mb-8">
                Commencez votre collection en ouvrant des packs de cartes !
              </p>
              <Link href="/boosters">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
                  Ouvrir des Packs
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardGrid cards={groupedCards} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
