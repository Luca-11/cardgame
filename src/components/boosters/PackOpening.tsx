"use client";

import { motion, AnimatePresence } from "framer-motion";
import { OpenedCard, PackOpeningState } from "@/types/cards";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";
import { CardDetail } from "@/components/cards/CardDetail";

interface PackOpeningProps {
  isOpen: boolean;
  _onClose: () => void;
  cards: OpenedCard[];
  onCollect: (cards: OpenedCard[]) => void;
  progress?: {
    current: number;
    total: number;
  };
}

const REVEAL_DELAY = 400;

// Animations des cartes
const cardVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
    y: 50,
  },
  visible: (index: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
};

// Animation de l'overlay
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// Animation du conteneur
const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export function PackOpening({
  isOpen,
  _onClose,
  cards,
  onCollect,
  progress,
}: PackOpeningProps) {
  const [state, setState] = useState<PackOpeningState>({
    isOpening: false,
    currentCardIndex: -1,
    cards: [],
  });

  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<OpenedCard | null>(null);
  const { playSound } = useSound();

  useEffect(() => {
    setState((prev) => ({
      isOpening: false,
      currentCardIndex: -1,
      cards: cards.map((card) => ({ ...card, isRevealed: false })),
    }));
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (isAutoRevealing) return;

    const card = state.cards[index];
    if (card.isRevealed) {
      setSelectedCard(card);
      return;
    }

    playSound("cardFlip");
    setState((prev) => {
      const newCards = [...prev.cards];
      newCards[index] = {
        ...newCards[index],
        isRevealed: !newCards[index].isRevealed,
      };
      return {
        ...prev,
        cards: newCards,
      };
    });
  };

  const startAutoReveal = () => {
    if (isAutoRevealing) return;
    setIsAutoRevealing(true);
    setState((prev) => ({
      ...prev,
      currentCardIndex: -1,
    }));
    setTimeout(() => revealNextCard(0), 100);
  };

  const revealNextCard = (index: number) => {
    if (index >= state.cards.length) {
      setIsAutoRevealing(false);
      return;
    }

    playSound("cardFlip");
    setState((prev) => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], isRevealed: true };
      return {
        ...prev,
        currentCardIndex: index,
        cards: newCards,
      };
    });

    setTimeout(() => revealNextCard(index + 1), REVEAL_DELAY);
  };

  const handleCollect = () => {
    onCollect(state.cards);
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
        return "shadow-[0_0_15px_rgba(168,85,247,0.5)]";
      case "rare":
        return "shadow-[0_0_15px_rgba(96,165,250,0.5)]";
      case "uncommon":
        return "shadow-[0_0_15px_rgba(74,222,128,0.5)]";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  const allCardsRevealed = state.cards.every((card) => card.isRevealed);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-gray-900 p-8 rounded-xl max-w-4xl w-full mx-4 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl" />

          <div className="relative">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {progress
                  ? `Booster ${progress.current}/${progress.total}`
                  : "Ouverture du Pack"}
              </h2>
              <p className="text-gray-400 mb-4">
                {state.cards.filter((c) => c.isRevealed).length} /{" "}
                {state.cards.length} cartes révélées
              </p>
              {!isAutoRevealing && !allCardsRevealed && (
                <Button
                  onClick={startAutoReveal}
                  variant="outline"
                  className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50"
                >
                  Tout révéler
                </Button>
              )}
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {state.cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="relative aspect-[2/3] perspective-1000"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <motion.div
                    className="cursor-pointer"
                    initial={false}
                    animate={{
                      rotateY: card.isRevealed ? 0 : 180,
                    }}
                    transition={{
                      duration: 0.8,
                      type: "spring",
                      stiffness: 60,
                      damping: 12,
                    }}
                    onClick={() => handleCardClick(index)}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Face avant (carte révélée) */}
                    <motion.div
                      className={`absolute inset-0 w-full h-full backface-hidden ${
                        card.isRevealed ? getRarityGlow(card.rarity) : ""
                      }`}
                      style={{
                        transform: "rotateY(0deg)",
                      }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-full p-3 flex flex-col bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-opacity-50 transition-all duration-300">
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
                    </motion.div>

                    {/* Face arrière (carte cachée) */}
                    <div
                      className="absolute inset-0 w-full h-full backface-hidden"
                      style={{
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg border-2 border-purple-500 flex items-center justify-center hover:from-purple-500 hover:to-purple-700 transition-colors duration-300">
                        <span className="text-4xl">🎴</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {allCardsRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center space-y-4"
              >
                <Button
                  onClick={handleCollect}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                  size="lg"
                >
                  {progress
                    ? progress.current < progress.total
                      ? "Ouvrir le prochain booster"
                      : "Terminer l'ouverture"
                    : "Ajouter à ma collection"}
                </Button>
                {progress && (
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-600"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(progress.current / progress.total) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {selectedCard && (
              <CardDetail
                card={selectedCard}
                isOpen={true}
                onClose={() => setSelectedCard(null)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
