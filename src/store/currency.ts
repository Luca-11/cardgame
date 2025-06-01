import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyState {
  diamonds: number;
  addDiamonds: (amount: number) => void;
  removeDiamonds: (amount: number) => boolean;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      diamonds: 2000, // Montant initial pour tester
      addDiamonds: (amount: number) =>
        set((state) => ({ diamonds: state.diamonds + amount })),
      removeDiamonds: (amount: number) => {
        const state = get();
        if (state.diamonds >= amount) {
          set({ diamonds: state.diamonds - amount });
          return true;
        }
        return false;
      },
    }),
    {
      name: "currency-storage",
    }
  )
);
