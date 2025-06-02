"use client";

import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { useDiamondsStore } from "@/store/diamonds";
import { useCardsStore, generateBoosterCards } from "@/store/cards";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { PackOpening } from "@/components/boosters/PackOpening";
import { useState } from "react";
import { OpenedCard } from "@/types/cards";
import { useSound } from "@/hooks/useSound";
import type { ReactElement } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: "booster" | "pack";
  boosterCount: number;
  cardsPerBooster: number;
  rarity: {
    common: number;
    uncommon: number;
    rare: number;
    legendary: number;
  };
}

const PRODUCTS: Product[] = [
  {
    id: "starter_pack",
    name: "Pack de démarrage",
    description: "Un pack parfait pour débuter !",
    price: 100,
    image: "🎴",
    type: "pack",
    boosterCount: 3,
    cardsPerBooster: 5,
    rarity: {
      common: 3,
      uncommon: 1,
      rare: 1,
      legendary: 0,
    },
  },
  {
    id: "premium_pack",
    name: "Pack premium",
    description: "Pour les collectionneurs avertis",
    price: 300,
    image: "✨",
    type: "pack",
    boosterCount: 5,
    cardsPerBooster: 5,
    rarity: {
      common: 2,
      uncommon: 2,
      rare: 1,
      legendary: 0,
    },
  },
  {
    id: "legendary_pack",
    name: "Pack légendaire",
    description: "Contient une carte légendaire garantie !",
    price: 1000,
    image: "💎",
    type: "pack",
    boosterCount: 10,
    cardsPerBooster: 5,
    rarity: {
      common: 2,
      uncommon: 1,
      rare: 1,
      legendary: 1,
    },
  },
];

export function BoostersClient() {
  const [currentBoosterIndex, setCurrentBoosterIndex] = useState(0);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [boosters, setBoosters] = useState<{ cards: OpenedCard[] }[]>([]);
  const { balance: diamonds, updateBalance } = useDiamondsStore();
  const { addCards } = useCardsStore();
  const { playSound } = useSound();

  const handlePurchase = (product: Product) => {
    if (diamonds < product.price) {
      toast.error("Vous n'avez pas assez de diamants !");
      return;
    }

    // Générer les boosters
    const newBoosters = Array.from({ length: product.boosterCount }, () => ({
      cards: generateBoosterCards(product.rarity).map((card) => ({
        ...card,
        isRevealed: false,
      })),
    }));

    setBoosters(newBoosters);
    setCurrentBoosterIndex(0);
    setIsOpeningPack(true);
    updateBalance(-product.price);
    playSound("purchase");
  };

  const handleClose = () => {
    setIsOpeningPack(false);
    setBoosters([]);
    setCurrentBoosterIndex(0);
  };

  const handleNextBooster = (cards: OpenedCard[]) => {
    // Ajouter les cartes à la collection
    addCards(cards);

    if (currentBoosterIndex < boosters.length - 1) {
      // Passer au prochain booster
      setCurrentBoosterIndex((prev: number) => prev + 1);
    } else {
      // Fermer le pack
      handleClose();
    }
  };

  return (
    <PageContainer>
      <div className="text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Boutique</h1>
          <CurrencyDisplay />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-xl p-6 flex flex-col"
            >
              <div className="text-4xl mb-4">{product.image}</div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-400 mb-4 flex-1">{product.description}</p>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nombre de boosters :</span>
                    <span className="font-bold">{product.boosterCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cartes par booster :</span>
                    <span className="font-bold">{product.cardsPerBooster}</span>
                  </div>
                  <div className="border-t border-gray-600 my-2" />
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Communes :</span>
                      <span className="font-bold">{product.rarity.common}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Peu communes :</span>
                      <span className="font-bold">
                        {product.rarity.uncommon}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rares :</span>
                      <span className="font-bold">{product.rarity.rare}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Légendaires :</span>
                      <span className="font-bold">
                        {product.rarity.legendary}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(product)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <span className="mr-2">💎</span>
                  {product.price}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <PackOpening
          isOpen={isOpeningPack}
          _onClose={handleClose}
          cards={boosters[currentBoosterIndex]?.cards || []}
          onCollect={handleNextBooster}
          progress={
            boosters.length > 1
              ? {
                  current: currentBoosterIndex + 1,
                  total: boosters.length,
                }
              : undefined
          }
        />
      </div>
    </PageContainer>
  );
}
