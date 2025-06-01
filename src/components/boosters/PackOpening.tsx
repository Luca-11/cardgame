"use client";

import { motion, AnimatePresence } from "framer-motion";
import { OpenedCard, PackOpeningState } from "@/types/cards";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface PackOpeningProps {
  isOpen: boolean;
  onClose: () => void;
  cards: OpenedCard[];
}

const REVEAL_DELAY = 800;

export function PackOpening({ isOpen, onClose, cards }: PackOpeningProps) {
  const [state, setState] = useState<PackOpeningState>({
    isOpening: false,
    currentCardIndex: -1,
    cards: cards.map((card) => ({ ...card, isRevealed: false })),
  });

  useEffect(() => {
    if (isOpen && !state.isOpening) {
      setState((prev) => ({ ...prev, isOpening: true }));
      setTimeout(revealNextCard, 500);
    }
  }, [isOpen]);

  const revealNextCard = () => {
    setState((prev) => {
      const nextIndex = prev.currentCardIndex + 1;
      if (nextIndex >= prev.cards.length) return prev;

      const newCards = [...prev.cards];
      newCards[nextIndex] = { ...newCards[nextIndex], isRevealed: true };

      return {
        ...prev,
        currentCardIndex: nextIndex,
        cards: newCards,
      };
    });

    if (state.currentCardIndex + 1 < cards.length - 1) {
      setTimeout(revealNextCard, REVEAL_DELAY);
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gray-900 p-8 rounded-xl max-w-4xl w-full mx-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />

            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Ouverture du Pack
                </h2>
                <p className="text-gray-400">
                  {state.currentCardIndex + 1} / {cards.length} cartes révélées
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 perspective-1000">
                {state.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ rotateY: 180, opacity: 0, y: 20 }}
                    animate={{
                      rotateY: card.isRevealed ? 0 : 180,
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      type: "spring",
                      duration: 0.8,
                      delay: card.isRevealed ? 0 : 0.1,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="aspect-[2/3] relative"
                  >
                    <div
                      className={`absolute inset-0 w-full h-full rounded-lg transition-transform duration-500 backface-hidden ${
                        card.isRevealed ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="h-full p-3 flex flex-col bg-gray-800 rounded-lg border-2 border-gray-700">
                        <div className="flex-1 bg-gray-700 rounded-lg mb-2" />
                        <h3
                          className={`font-bold ${getRarityColor(card.rarity)}`}
                        >
                          {card.name}
                        </h3>
                        <div className="flex justify-between text-xs mt-1 text-white">
                          <span>⚔️ {card.attack}</span>
                          <span>🛡️ {card.defense}</span>
                          <span>✨ {card.mana}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`absolute inset-0 w-full h-full rounded-lg transition-transform duration-500 backface-hidden rotateY-180 ${
                        card.isRevealed ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <div className="h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg border-2 border-purple-500 flex items-center justify-center shadow-xl">
                        <span className="text-4xl transform scale-[-1]">
                          🎴
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {state.currentCardIndex === cards.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center"
                >
                  <Button
                    onClick={onClose}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    Ajouter à ma collection
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
