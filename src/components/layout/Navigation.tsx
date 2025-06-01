"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";

const NAVIGATION_ITEMS = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Packs & Boosters",
    href: "/boosters",
  },
  {
    label: "Collection",
    href: "/collection",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === item.href
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <CurrencyDisplay />
        </div>
      </div>
    </nav>
  );
}
