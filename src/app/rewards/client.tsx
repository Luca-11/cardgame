"use client";

import { useEffect } from "react";
import { useRewardsStore } from "@/store/rewards";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RewardsClient() {
  const {
    quests,
    loginStreak,
    isLoading,
    fetchQuests,
    checkDailyLogin,
    claimQuestReward,
    claimLoginReward,
  } = useRewardsStore();

  useEffect(() => {
    checkDailyLogin();
    fetchQuests();
  }, [checkDailyLogin, fetchQuests]);

  const handleClaimLoginReward = async () => {
    const success = await claimLoginReward();
    if (success) {
      const baseReward = 50;
      const streakBonus =
        Math.min((loginStreak?.current_streak || 1) - 1, 6) * 10;
      const totalReward = baseReward + streakBonus;
      toast.success(`Récompense quotidienne réclamée : +${totalReward} 💎`);
    }
  };

  const handleClaimQuestReward = async (questId: string) => {
    const success = await claimQuestReward(questId);
    if (success) {
      const quest = quests.find((q) => q.id === questId);
      toast.success(
        `Récompense de quête réclamée : +${quest?.reward_amount} 💎`
      );
    }
  };

  const getQuestDescription = (type: string, target: number) => {
    switch (type) {
      case "open_boosters":
        return `Ouvrir ${target} boosters`;
      case "open_packs":
        return `Ouvrir ${target} packs`;
      case "collect_cards":
        return `Collecter ${target} cartes`;
      default:
        return "Quête inconnue";
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-white text-center">Chargement...</div>
      </PageContainer>
    );
  }

  const canClaimLoginReward =
    loginStreak &&
    (!loginStreak.last_reward_claimed_at ||
      new Date(loginStreak.last_reward_claimed_at)
        .toISOString()
        .split("T")[0] !== new Date().toISOString().split("T")[0]);

  const getQuestButtonState = (quest: (typeof quests)[number]) => {
    if (quest.claimed_at) return { text: "Réclamé", disabled: true };
    if (quest.completed_at) return { text: "Réclamer", disabled: false };
    return { text: "En cours", disabled: true };
  };

  return (
    <PageContainer>
      <div className="text-white">
        <h1 className="text-4xl font-bold mb-8">Récompenses Quotidiennes</h1>

        {/* Section Connexion */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Connexion Quotidienne</h2>
              <p className="text-gray-400">
                Série actuelle : {loginStreak?.current_streak || 0} jours
              </p>
              <p className="text-gray-400">
                Plus longue série : {loginStreak?.longest_streak || 0} jours
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg mb-2">
                {50 + Math.min((loginStreak?.current_streak || 1) - 1, 6) * 10}{" "}
                💎
              </p>
              <Button
                onClick={handleClaimLoginReward}
                disabled={!canClaimLoginReward}
                className={`${
                  canClaimLoginReward
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                {canClaimLoginReward ? "Réclamer" : "Déjà réclamé"}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded ${
                  (loginStreak?.current_streak || 0) > i
                    ? "bg-purple-500"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Section Quêtes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Quêtes du Jour</h2>
          {quests.map((quest) => {
            const buttonState = getQuestButtonState(quest);
            return (
              <div
                key={quest.id}
                className="bg-gray-800 rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold mb-1">
                    {getQuestDescription(quest.quest_type, quest.target)}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(quest.progress / quest.target) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg mb-2">{quest.reward_amount} 💎</p>
                  <Button
                    onClick={() => handleClaimQuestReward(quest.id)}
                    disabled={buttonState.disabled}
                    className={`${
                      buttonState.disabled
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {buttonState.text}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
