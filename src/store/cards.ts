import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Card, CardRarity } from "@/types/cards";

interface CardsState {
  collection: Card[];
  addCards: (cards: Card[]) => void;
}

const generateRandomCard = (rarity: CardRarity): Card => {
  const id = Math.random().toString(36).substring(7);
  const names = {
    common: ["Gobelin", "Soldat", "Archer", "Paysan"],
    uncommon: ["Chevalier", "Mage", "Assassin", "Prêtre"],
    rare: ["Dragon", "Licorne", "Phénix", "Golem"],
    legendary: ["Roi des Dragons", "Archange", "Titan", "Dieu Ancien"],
  };

  const name = names[rarity][Math.floor(Math.random() * names[rarity].length)];

  const stats = {
    common: { attack: 1, defense: 1, mana: 1 },
    uncommon: { attack: 2, defense: 2, mana: 2 },
    rare: { attack: 3, defense: 3, mana: 3 },
    legendary: { attack: 4, defense: 4, mana: 4 },
  };

  return {
    id,
    name,
    description: `Un ${name} puissant`,
    image: `/cards/${rarity}.jpg`,
    rarity,
    ...stats[rarity],
  };
};

export const generateBoosterCards = (
  rarityDistribution: Record<CardRarity, number>
): Card[] => {
  const cards: Card[] = [];

  Object.entries(rarityDistribution).forEach(([rarity, count]) => {
    for (let i = 0; i < count; i++) {
      cards.push(generateRandomCard(rarity as CardRarity));
    }
  });

  return cards;
};

export const useCardsStore = create<CardsState>()(
  persist(
    (set) => ({
      collection: [],
      addCards: (cards: Card[]) =>
        set((state) => ({
          collection: [...state.collection, ...cards],
        })),
    }),
    {
      name: "cards-storage",
    }
  )
);
