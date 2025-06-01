export type CardRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: CardRarity;
  attack: number;
  defense: number;
  mana: number;
}

export interface OpenedCard extends Card {
  isRevealed: boolean;
}

export interface PackOpeningState {
  isOpening: boolean;
  currentCardIndex: number;
  cards: OpenedCard[];
}
