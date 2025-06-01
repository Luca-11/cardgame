"use client";

import { memo } from "react";
import { Navigation } from "./Navigation";
import { PageTransition } from "./PageTransition";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = memo(function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
});
