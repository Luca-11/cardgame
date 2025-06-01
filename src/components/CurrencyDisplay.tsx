"use client";

import { useCurrencyStore } from "@/store/currency";
import { Button } from "@/components/ui/button";

export function CurrencyDisplay() {
  const diamonds = useCurrencyStore((state) => state.diamonds);
  const addDiamonds = useCurrencyStore((state) => state.addDiamonds);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
        <span className="text-white font-bold">{diamonds}</span>
        <span className="text-lg">💎</span>
      </div>
      {process.env.NODE_ENV === "development" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addDiamonds(1000)}
          className="text-xs border-dashed"
        >
          +1000 💎
        </Button>
      )}
    </div>
  );
}
