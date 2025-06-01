import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useDiamondsStore } from "./diamonds";
import { toast } from "sonner";

interface DailyQuest {
  id: string;
  quest_type: "open_boosters" | "open_packs" | "collect_cards";
  progress: number;
  target: number;
  reward_amount: number;
  completed_at: string | null;
  claimed_at: string | null;
}

interface LoginStreak {
  current_streak: number;
  longest_streak: number;
  last_login_date: string;
  last_reward_claimed_at: string | null;
}

interface RewardsState {
  quests: DailyQuest[];
  loginStreak: LoginStreak | null;
  isLoading: boolean;
  error: string | null;
  fetchQuests: () => Promise<void>;
  updateQuestProgress: (
    questType: DailyQuest["quest_type"],
    progress: number
  ) => Promise<void>;
  claimQuestReward: (questId: string) => Promise<boolean>;
  checkDailyLogin: () => Promise<void>;
  claimLoginReward: () => Promise<boolean>;
  hasRewardsToCollect: () => boolean;
}

export const useRewardsStore = create<RewardsState>()((set, get) => ({
  quests: [],
  loginStreak: null,
  isLoading: false,
  error: null,

  fetchQuests: async () => {
    set({ isLoading: true, error: null });
    try {
      // Vérifier l'authentification
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError)
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      if (!user) throw new Error("Utilisateur non connecté");

      // Générer les quêtes quotidiennes si nécessaire
      await supabase.rpc("generate_daily_quests", { p_user_id: user.id });

      // Récupérer les quêtes
      const { data: quests, error: questsError } = await supabase
        .from("daily_quests")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", new Date().toISOString().split("T")[0]);

      if (questsError)
        throw new Error(`Erreur Supabase: ${questsError.message}`);

      set({ quests: quests || [], isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération des quêtes:", error);
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  updateQuestProgress: async (questType, progress) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError)
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      if (!user) throw new Error("Utilisateur non connecté");

      const quest = get().quests.find(
        (q) => q.quest_type === questType && !q.completed_at
      );
      if (!quest) return;

      const newProgress = quest.progress + progress;
      const completed = newProgress >= quest.target;

      const { error } = await supabase
        .from("daily_quests")
        .update({
          progress: Math.min(newProgress, quest.target),
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", quest.id);

      if (error) throw new Error(`Erreur Supabase: ${error.message}`);

      // Mettre à jour le state local
      const updatedQuests = get().quests.map((q) =>
        q.id === quest.id
          ? {
              ...q,
              progress: Math.min(newProgress, quest.target),
              completed_at: completed ? new Date().toISOString() : null,
            }
          : q
      );
      set({ quests: updatedQuests });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression:", error);
    }
  },

  claimQuestReward: async (questId) => {
    try {
      const quest = get().quests.find((q) => q.id === questId);
      if (!quest) {
        toast.error("Quête introuvable !");
        return false;
      }

      if (!quest.completed_at) {
        toast.error("Cette quête n'est pas encore terminée !");
        return false;
      }

      if (quest.claimed_at) {
        toast.error("Vous avez déjà réclamé cette récompense !");
        return false;
      }

      const { error } = await supabase
        .from("daily_quests")
        .update({ claimed_at: new Date().toISOString() })
        .eq("id", questId);

      if (error) throw new Error(`Erreur Supabase: ${error.message}`);

      // Mettre à jour le solde de diamants
      await useDiamondsStore.getState().updateBalance(quest.reward_amount);

      // Mettre à jour le state local
      const updatedQuests = get().quests.map((q) =>
        q.id === questId ? { ...q, claimed_at: new Date().toISOString() } : q
      );
      set({ quests: updatedQuests });

      return true;
    } catch (error) {
      console.error("Erreur lors de la réclamation de la récompense:", error);
      toast.error(
        "Une erreur est survenue lors de la réclamation de la récompense"
      );
      return false;
    }
  },

  checkDailyLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError)
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      if (!user) throw new Error("Utilisateur non connecté");

      const today = new Date().toISOString().split("T")[0];

      // Récupérer ou créer l'entrée de login
      const { data: loginData, error: loginError } = await supabase
        .from("daily_logins")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (loginError && loginError.code !== "PGRST116") {
        throw new Error(`Erreur Supabase: ${loginError.message}`);
      }

      if (!loginData) {
        // Première connexion
        const { data: newLogin, error: insertError } = await supabase
          .from("daily_logins")
          .insert({
            user_id: user.id,
            last_login_date: today,
            current_streak: 1,
            longest_streak: 1,
          })
          .select()
          .single();

        if (insertError)
          throw new Error(`Erreur Supabase: ${insertError.message}`);
        set({ loginStreak: newLogin, isLoading: false });
        return;
      }

      // Vérifier si c'est une nouvelle journée
      const lastLogin = new Date(loginData.last_login_date);
      const lastLoginDay = new Date(
        lastLogin.getFullYear(),
        lastLogin.getMonth(),
        lastLogin.getDate()
      );
      const today_date = new Date();
      const todayDay = new Date(
        today_date.getFullYear(),
        today_date.getMonth(),
        today_date.getDate()
      );
      const daysDiff = Math.floor(
        (todayDay.getTime() - lastLoginDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      let newStreak = loginData.current_streak;
      if (daysDiff === 1) {
        // Jour consécutif
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Streak brisé
        newStreak = 1;
      }

      // Mettre à jour le login streak
      const { data: updatedLogin, error: updateError } = await supabase
        .from("daily_logins")
        .update({
          last_login_date: today,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, loginData.longest_streak),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError)
        throw new Error(`Erreur Supabase: ${updateError.message}`);
      set({ loginStreak: updatedLogin, isLoading: false });
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du login quotidien:",
        error
      );
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  claimLoginReward: async () => {
    try {
      const loginStreak = get().loginStreak;
      const today = new Date().toISOString().split("T")[0];

      if (!loginStreak) {
        return false;
      }

      // Vérifier si la récompense a déjà été réclamée aujourd'hui
      const lastClaimDate = loginStreak.last_reward_claimed_at
        ? new Date(loginStreak.last_reward_claimed_at)
            .toISOString()
            .split("T")[0]
        : null;

      if (lastClaimDate === today) {
        toast.error("Vous avez déjà réclamé votre récompense aujourd'hui !");
        return false;
      }

      // Calculer la récompense basée sur le streak
      const baseReward = 50;
      const streakBonus = Math.min(loginStreak.current_streak - 1, 6) * 10; // +10 par jour jusqu'à 7 jours
      const totalReward = baseReward + streakBonus;

      // Mettre à jour la date de réclamation
      const { error } = await supabase
        .from("daily_logins")
        .update({ last_reward_claimed_at: new Date().toISOString() })
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw new Error(`Erreur Supabase: ${error.message}`);

      // Ajouter les diamants
      await useDiamondsStore.getState().updateBalance(totalReward);

      // Mettre à jour le state local
      set({
        loginStreak: {
          ...loginStreak,
          last_reward_claimed_at: new Date().toISOString(),
        },
      });

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la réclamation de la récompense de connexion:",
        error
      );
      return false;
    }
  },

  hasRewardsToCollect: () => {
    const state = get();

    // Vérifier si la récompense quotidienne est disponible
    const today = new Date().toISOString().split("T")[0];
    const canClaimLoginReward =
      state.loginStreak &&
      (!state.loginStreak.last_reward_claimed_at ||
        new Date(state.loginStreak.last_reward_claimed_at)
          .toISOString()
          .split("T")[0] !== today);

    // Vérifier s'il y a des quêtes complétées mais non réclamées
    const hasCompletedQuests = state.quests.some(
      (quest) => quest.completed_at && !quest.claimed_at
    );

    return canClaimLoginReward || hasCompletedQuests;
  },
}));
