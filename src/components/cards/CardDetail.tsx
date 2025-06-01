"use client";

import { motion, AnimatePresence } from "framer-motion";
import { OpenedCard, Card } from "@/types/cards";
import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface CardDetailProps {
  card: OpenedCard | (Card & { isRevealed?: boolean });
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "text-purple-400";
    case "rare":
      return "text-blue-400";
    case "uncommon":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "shadow-[0_0_30px_rgba(168,85,247,0.5)]";
    case "rare":
      return "shadow-[0_0_30px_rgba(96,165,250,0.5)]";
    case "uncommon":
      return "shadow-[0_0_30px_rgba(74,222,128,0.5)]";
    default:
      return "";
  }
};

export function CardDetail({ card, isOpen, onClose }: CardDetailProps) {
  const { playSound } = useSound();

  useEffect(() => {
    if (isOpen) {
      playSound("cardFlip");
    }
  }, [isOpen, playSound]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`aspect-[2/3] w-[300px] p-6 bg-gray-800 rounded-xl border-4 ${getRarityGlow(
                card.rarity
              )}`}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-gray-700 rounded-lg mb-4" />

                <div className="space-y-4">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${getRarityColor(
                        card.rarity
                      )}`}
                    >
                      {card.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {card.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-700 rounded p-2">
                      <span className="block text-sm text-gray-400">
                        Attaque
                      </span>
                      <span className="text-xl font-bold text-red-400">
                        ⚔️ {card.attack}
                      </span>
                    </div>
                    <div className="bg-gray-700 rounded p-2">
                      <span className="block text-sm text-gray-400">
                        Défense
                      </span>
                      <span className="text-xl font-bold text-blue-400">
                        🛡️ {card.defense}
                      </span>
                    </div>
                    <div className="bg-gray-700 rounded p-2">
                      <span className="block text-sm text-gray-400">Mana</span>
                      <span className="text-xl font-bold text-purple-400">
                        ✨ {card.mana}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`text-sm font-medium ${getRarityColor(
                        card.rarity
                      )}`}
                    >
                      {card.rarity.charAt(0).toUpperCase() +
                        card.rarity.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
