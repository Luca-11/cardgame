import { create } from "zustand";
import { Card, CardRarity } from "@/types/cards";
import { supabase } from "@/lib/supabase";

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  addCards: (newCards: Card[]) => void;
  fetchCollection: () => Promise<void>;
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

// Fonction utilitaire pour mélanger un tableau
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateBoosterCards = (
  rarityDistribution: Record<CardRarity, number>
): Card[] => {
  const cards: Card[] = [];

  // Générer les cartes par rareté
  Object.entries(rarityDistribution).forEach(([rarity, count]) => {
    for (let i = 0; i < count; i++) {
      cards.push(generateRandomCard(rarity as CardRarity));
    }
  });

  // Mélanger les cartes avant de les retourner
  return shuffleArray(cards);
};

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  isLoading: false,
  
  fetchCollection: async () => {
    set({ isLoading: true });
    try {
      const { data: userCards, error } = await supabase
        .from("user_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const cards = userCards?.map((card) => ({
        id: card.id,
        name: card.card_name,
        description: card.card_description,
        image: card.card_image,
        rarity: card.card_rarity as CardRarity,
        attack: card.card_attack,
        defense: card.card_defense,
        mana: card.card_mana,
      })) || [];

      set({ cards, isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération de la collection:", error);
      set({ isLoading: false });
    }
  },

  addCards: (newCards) => set((state) => ({ 
    cards: [...state.cards, ...newCards] 
  })),
}));
