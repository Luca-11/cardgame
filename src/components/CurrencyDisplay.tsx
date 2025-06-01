import { useCurrencyStore } from "@/store/currency";

export function CurrencyDisplay() {
  const diamonds = useCurrencyStore((state) => state.diamonds);

  return (
    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
      <span className="text-white font-bold">{diamonds}</span>
      <span className="text-lg">💎</span>
    </div>
  );
}
