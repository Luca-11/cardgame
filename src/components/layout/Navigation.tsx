"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { useRewardsStore } from "@/store/rewards";
import { useEffect } from "react";
import { motion } from "framer-motion";

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
  {
    label: "Récompenses",
    href: "/rewards",
  },
];

const navItemVariants = {
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const notificationVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export function Navigation() {
  const pathname = usePathname();
  const { hasRewardsToCollect, fetchQuests, checkDailyLogin } =
    useRewardsStore();

  useEffect(() => {
    Promise.all([fetchQuests(), checkDailyLogin()]).catch(console.error);
  }, [fetchQuests, checkDailyLogin]);

  return (
    <motion.nav
      className="bg-gray-900 border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <motion.div
                key={item.href}
                variants={navItemVariants}
                whileHover="hover"
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white relative group ${
                    pathname === item.href ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
                      layoutId="underline"
                    />
                  )}
                  {item.label === "Récompenses" && hasRewardsToCollect() && (
                    <motion.span
                      className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"
                      variants={notificationVariants}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          <CurrencyDisplay />
        </div>
      </div>
    </motion.nav>
  );
}
