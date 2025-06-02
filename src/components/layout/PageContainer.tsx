"use client";

import { memo } from "react";
import { Navbar } from "./Navbar";
import { PageTransition } from "./PageTransition";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = memo(function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-28">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
});
