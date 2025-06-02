"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  // Ces données devraient venir de votre état global ou API
  const userStats = {
    cardsTotal: 342,
    cardsRare: 45,
    cardsLegendary: 12,
    duelsWon: 157,
    duelsTotal: 248,
    rank: "Maître des Cartes",
    level: 34,
    xp: 7800,
    xpNeeded: 10000,
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse" />
                  <Image
                    src="/images/default-avatar.png"
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-black relative z-10"
                  />
                </div>

                <h1 className="mt-4 text-2xl font-bold text-white">
                  Joueur Épique
                </h1>
                <p className="text-purple-400">{userStats.rank}</p>

                {/* Barre de progression */}
                <div className="w-full mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Niveau {userStats.level}</span>
                    <span>
                      {userStats.xp}/{userStats.xpNeeded} XP
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                      style={{
                        width: `${(userStats.xp / userStats.xpNeeded) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-600">
                  Éditer le profil
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20">
              <h2 className="text-xl font-semibold text-white mb-6">
                Statistiques
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-sm text-gray-400">Collection</h3>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {userStats.cardsTotal}
                        </p>
                        <p className="text-xs text-gray-400">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">
                          {userStats.cardsRare}
                        </p>
                        <p className="text-xs text-gray-400">Rares</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">
                          {userStats.cardsLegendary}
                        </p>
                        <p className="text-xs text-gray-400">Légendaires</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-sm text-gray-400">Duels</h3>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-white">
                        {Math.round(
                          (userStats.duelsWon / userStats.duelsTotal) * 100
                        )}
                        %
                        <span className="text-sm text-gray-400 ml-2">
                          ({userStats.duelsWon}/{userStats.duelsTotal})
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">Taux de victoire</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-sm text-gray-400">Succès récents</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                          🏆
                        </div>
                        <div>
                          <p className="text-white">Premier Duel Gagné</p>
                          <p className="text-xs text-gray-400">
                            Il y a 2 jours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          ⚔️
                        </div>
                        <div>
                          <p className="text-white">10 Duels Consécutifs</p>
                          <p className="text-xs text-gray-400">
                            Il y a 5 jours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-sm text-gray-400">Cartes Favorites</h3>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="aspect-[3/4] rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                        >
                          <span className="text-2xl">🎴</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
