import { supabase } from "@/lib/supabase";
import type { Card, UserCollection } from "@/lib/supabase";

export const cardService = {
  // Récupérer toutes les cartes
  async getAllCards(): Promise<Card[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  // Récupérer la collection d'un utilisateur
  async getUserCollection(userId: string): Promise<UserCollection[]> {
    const { data, error } = await supabase
      .from("user_collections")
      .select(
        `
        *,
        cards (*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },

  // Ajouter une carte à la collection
  async addToCollection(
    userId: string,
    cardId: string,
    quantity: number = 1
  ): Promise<void> {
    const { error } = await supabase.from("user_collections").upsert({
      user_id: userId,
      card_id: cardId,
      quantity,
      acquired_at: new Date().toISOString(),
    });

    if (error) throw error;
  },

  // Mettre à jour la quantité d'une carte
  async updateCardQuantity(
    userId: string,
    cardId: string,
    quantity: number
  ): Promise<void> {
    const { error } = await supabase
      .from("user_collections")
      .update({ quantity })
      .match({ user_id: userId, card_id: cardId });

    if (error) throw error;
  },
};
