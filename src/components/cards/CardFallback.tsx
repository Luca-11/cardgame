type CardRarity = "common" | "uncommon" | "rare" | "legendary";

interface CardFallbackProps {
  name: string;
  rarity: CardRarity;
}

const rarityGradients = {
  common: "from-gray-200 to-gray-300",
  uncommon: "from-green-200 to-green-300",
  rare: "from-blue-200 to-blue-300",
  legendary: "from-purple-200 to-purple-300",
} as const;

export function CardFallback({ name, rarity }: CardFallbackProps) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${rarityGradients[rarity]} flex flex-col items-center justify-center`}
    >
      <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-2">
        <span className="text-2xl font-bold text-gray-700">
          {name[0].toUpperCase()}
        </span>
      </div>
      <div className="text-sm text-gray-700 font-medium">{name}</div>
    </div>
  );
}
