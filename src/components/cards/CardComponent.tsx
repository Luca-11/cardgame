import Image from "next/image";
import { type Card } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { getCardImageUrl } from "@/lib/image-utils";
import { useState } from "react";
import { CardFallback } from "./CardFallback";

interface CardComponentProps {
  card: Card;
  className?: string;
}

const rarityColors = {
  common: "bg-gray-200",
  uncommon: "bg-green-200",
  rare: "bg-blue-200",
  legendary: "bg-purple-200",
};

export const CardComponent = ({ card, className }: CardComponentProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105",
        rarityColors[card.rarity],
        className
      )}
    >
      <div className="aspect-[3/4] relative bg-gray-100">
        {!imageError ? (
          <Image
            src={getCardImageUrl(card.image_url)}
            alt={card.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <CardFallback name={card.name} rarity={card.rarity} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{card.name}</h3>
        <p className="text-sm text-gray-600">{card.description}</p>
        <span
          className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-opacity-50"
          style={{ backgroundColor: rarityColors[card.rarity] }}
        >
          {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
        </span>
      </div>
    </div>
  );
};
