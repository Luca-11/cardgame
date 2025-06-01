"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CollectionPage() {
  return (
    <PageContainer>
      <div className="text-white">
        <h1 className="text-4xl font-bold mb-8">Ma Collection</h1>

        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl mb-4">Votre collection est vide</h2>
          <p className="text-gray-400 mb-8">
            Commencez votre collection en ouvrant des packs de cartes !
          </p>
          <Link href="/boosters">
            <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
              Ouvrir des Packs
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
