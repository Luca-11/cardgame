"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Configuration fixe des orbes pour éviter les problèmes d'hydratation
const ORBS_CONFIG = [
  {
    width: 265,
    height: 205,
    left: 49,
    top: 10,
    delay: 0,
  },
  {
    width: 190,
    height: 249,
    left: 7,
    top: 60,
    delay: -2,
  },
  {
    width: 128,
    height: 288,
    left: 45,
    top: 3,
    delay: -4,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)]" />

          {/* Orbes lumineux flottants */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {ORBS_CONFIG.map((orb, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${orb.width}px`,
                  height: `${orb.height}px`,
                  left: `${orb.left}%`,
                  top: `${orb.top}%`,
                  background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)`,
                  animationDelay: `${orb.delay}s`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Contenu principal */}
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Entrez dans l&apos;Arène
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez un univers de cartes légendaires, constituez votre
              collection et affrontez les meilleurs joueurs dans des duels
              épiques.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 hover:glow"
                >
                  Commencer l&apos;aventure
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  Découvrir le jeu
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Caractéristiques */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Collection Unique */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20 hover:border-purple-500/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Collection Unique
              </h3>
              <p className="mt-2 text-gray-400">
                Plus de 1000 cartes à collectionner avec des illustrations
                époustouflantes.
              </p>
            </motion.div>

            {/* Duels Stratégiques */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20 hover:border-purple-500/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Duels Stratégiques
              </h3>
              <p className="mt-2 text-gray-400">
                Affrontez d&apos;autres joueurs dans des combats tactiques
                passionnants.
              </p>
            </motion.div>

            {/* Récompenses Quotidiennes */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-purple-900/20 hover:border-purple-500/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Récompenses Quotidiennes
              </h3>
              <p className="mt-2 text-gray-400">
                Gagnez des récompenses chaque jour et développez votre
                collection.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
