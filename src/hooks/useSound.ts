import { useCallback } from "react";

const SOUNDS = {
  cardFlip: "/sounds/card-flip.mp3",
  reward: "/sounds/reward.mp3",
  purchase: "/sounds/purchase.mp3",
  hover: "/sounds/hover.mp3",
} as const;

export function useSound() {
  const playSound = useCallback((soundName: keyof typeof SOUNDS) => {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = 0.3; // Volume modéré
    audio.play().catch(() => {
      // Ignorer les erreurs de lecture (par exemple si l'utilisateur n'a pas interagi avec la page)
    });
  }, []);

  return { playSound };
}
