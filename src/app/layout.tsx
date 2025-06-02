"use client";

import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        {/* Fond animé */}
        <div className="fixed inset-0 -z-10 bg-black">
          {/* Gradient radial */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />

          {/* Points lumineux */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 8%)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Effet de brume */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/10 via-purple-900/5 to-black/20 animate-pulse"
            style={{ animationDuration: "10s" }}
          />
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Contenu principal */}
        {children}
      </body>
    </html>
  );
}
