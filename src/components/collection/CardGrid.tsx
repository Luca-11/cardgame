"use client";

import { Card } from "@/types/cards";
import { useState } from "react";
import { CardDetail } from "@/components/cards/CardDetail";

interface CardWithCount extends Card {
  count?: number;
}

type CardGridProps = {
  cards: CardWithCount[];
};

export function CardGrid({ cards }: CardGridProps) {
  const [selectedCard, setSelectedCard] = useState<
    (CardWithCount & { isRevealed: boolean }) | null
  >(null);

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

  const handleCardClick = (card: CardWithCount) => {
    setSelectedCard({
      ...card,
      isRevealed: true,
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all cursor-pointer ${getRarityGlow(
              card.rarity
            )}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="aspect-[3/4] bg-gray-700 relative">
              {/* Image placeholder */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                🎴
              </div>
              {card.count && card.count > 1 && (
                <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-sm font-bold">
                  x{card.count}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className={`font-bold ${getRarityColor(card.rarity)}`}>
                {card.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{card.description}</p>

              <div className="flex justify-between text-xs mt-2 text-white">
                <span>⚔️ {card.attack}</span>
                <span>🛡️ {card.defense}</span>
                <span>✨ {card.mana}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          isOpen={true}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}
