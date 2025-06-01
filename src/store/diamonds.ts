import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface DiamondsState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  updateBalance: (amount: number) => Promise<boolean>;
}

export const useDiamondsStore = create<DiamondsState>()((set, get) => ({
  balance: 0,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      // Vérifier si l'utilisateur est connecté
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      }

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Récupérer le solde de l'utilisateur
      let { data, error } = await supabase
        .from("user_diamonds")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      // Si l'utilisateur n'a pas encore de solde, en créer un
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("user_diamonds")
          .insert({ user_id: user.id, balance: 1000 })
          .select("balance")
          .single();

        if (insertError) {
          throw new Error(
            `Erreur lors de la création du solde initial: ${insertError.message}`
          );
        }

        data = newData;
      }

      set({ balance: data?.balance ?? 1000, isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  updateBalance: async (amount: number) => {
    set({ isLoading: true, error: null });
    try {
      // Vérifier si l'utilisateur est connecté
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      }

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const newBalance = get().balance + amount;

      // Vérifier si le solde serait suffisant
      if (newBalance < 0) {
        set({
          error: "Solde insuffisant",
          isLoading: false,
        });
        return false;
      }

      const { error } = await supabase
        .from("user_diamonds")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      set({ balance: newBalance, isLoading: false });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du solde:", error);
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      return false;
    }
  },
}));
