import Image from "next/image";
import { type Card } from "@/lib/supabase";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105",
        rarityColors[card.rarity],
        className
      )}
    >
      <div className="aspect-[3/4] relative">
        <Image
          src={card.image_url}
          alt={card.name}
          fill
          className="object-cover"
        />
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
