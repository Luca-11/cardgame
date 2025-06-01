import { useState } from "react";
import { CardComponent } from "@/components/cards/CardComponent";
import type { Card } from "@/lib/supabase";

type CardGridProps = {
  cards: Card[];
};

type FilterOptions = {
  search: string;
  rarity: string | null;
};

export function CardGrid({ cards }: CardGridProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    rarity: null,
  });

  const filteredCards = cards.filter((card) => {
    // Filtre par recherche
    if (
      filters.search &&
      !card.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filtre par rareté
    if (filters.rarity && card.rarity !== filters.rarity) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Filtres */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <input
          type="text"
          placeholder="Rechercher une carte..."
          className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.rarity || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              rarity: e.target.value || null,
            })
          }
        >
          <option value="">Toutes les raretés</option>
          <option value="common">Commune</option>
          <option value="uncommon">Peu commune</option>
          <option value="rare">Rare</option>
          <option value="legendary">Légendaire</option>
        </select>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCards.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}
      </div>

      {/* Message si aucune carte */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune carte ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
}
