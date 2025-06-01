"use client";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";

export default function Home() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center text-center space-y-8 text-white">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Card Game Universe
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl">
          Plongez dans un univers de cartes stratégiques. Collectionnez,
          échangez et battez-vous dans une expérience de jeu unique.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-2xl">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all">
            <h3 className="text-xl font-semibold mb-2">Packs & Boosters</h3>
            <p className="text-gray-400 mb-4">
              Découvrez de nouvelles cartes et enrichissez votre collection avec
              nos packs.
            </p>
            <Link href="/boosters" className="block">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Ouvrir des Packs
              </Button>
            </Link>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-pink-500 transition-all">
            <h3 className="text-xl font-semibold mb-2">Ma Collection</h3>
            <p className="text-gray-400 mb-4">
              Gérez votre collection de cartes et créez des decks puissants.
            </p>
            <Link href="/collection" className="block">
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700"
                size="lg"
              >
                Voir ma Collection
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          <p>🎮 Commencez votre aventure dès maintenant !</p>
        </div>
      </div>
    </PageContainer>
  );
}
