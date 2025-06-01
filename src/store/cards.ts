import { create } from "zustand";
import { Card, CardRarity } from "@/types/cards";
import { supabase } from "@/lib/supabase";

interface CardsState {
  collection: Card[];
  addCards: (cards: Card[]) => Promise<void>;
  fetchCollection: () => Promise<void>;
  isLoading: boolean;
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

export const useCardsStore = create<CardsState>()((set, get) => ({
  collection: [],
  isLoading: false,

  fetchCollection: async () => {
    set({ isLoading: true });
    try {
      const { data: userCards, error } = await supabase
        .from("user_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur lors de la récupération de la collection:",
          error
        );
        return;
      }

      // Convertir les cartes de la base de données en format de l'application
      const cards =
        userCards?.map((card) => ({
          id: card.id,
          name: card.card_name,
          description: card.card_description,
          image: card.card_image,
          rarity: card.card_rarity as CardRarity,
          attack: card.card_attack,
          defense: card.card_defense,
          mana: card.card_mana,
        })) || [];

      set({ collection: cards, isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération de la collection:", error);
      set({ isLoading: false });
    }
  },

  addCards: async (cards: Card[]) => {
    try {
      // Vérifier l'utilisateur
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        throw new Error(`Erreur d'authentification: ${userError.message}`);
      }
      if (!userData.user) {
        throw new Error("Utilisateur non connecté");
      }

      console.log("🔍 Ajout de cartes pour l'utilisateur:", userData.user.id);
      console.log("📦 Cartes à ajouter:", cards);

      // Préparer les données pour l'insertion
      const cardsToInsert = cards.map((card) => ({
        user_id: userData.user.id,
        card_name: card.name,
        card_description: card.description,
        card_image: card.image,
        card_rarity: card.rarity,
        card_attack: card.attack,
        card_defense: card.defense,
        card_mana: card.mana,
        created_at: new Date().toISOString(),
      }));

      console.log("📝 Données préparées pour l'insertion:", cardsToInsert);

      // Insérer les cartes
      const { data: insertData, error: insertError } = await supabase
        .from("user_cards")
        .insert(cardsToInsert)
        .select();

      console.log("📊 Résultat de l'insertion:", {
        data: insertData,
        error: insertError,
      });

      if (insertError) {
        console.error("❌ Erreur détaillée de l'insertion:", {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
        throw new Error(
          `Erreur d'insertion: ${
            insertError.message || JSON.stringify(insertError)
          }`
        );
      }

      console.log("✅ Cartes ajoutées avec succès:", insertData);

      // Mettre à jour la collection locale
      await get().fetchCollection();
    } catch (error) {
      console.error("❌ Erreur détaillée lors de l'ajout des cartes:", error);
      throw error; // Propager l'erreur pour la gestion dans le composant
    }
  },
}));
