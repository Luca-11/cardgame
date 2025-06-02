"use client";

import { useDiamondsStore } from "@/store/diamonds";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "./ui/loading";
import { Coins, Gem, Sparkles, Star, Trophy, Crown } from "lucide-react";

export function CurrencyDisplay() {
  const { balance, isLoading, fetchBalance } = useDiamondsStore();

  const debouncedFetchBalance = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchBalance, 300);
    };
  }, [fetchBalance]);

  useEffect(() => {
    const fetch = debouncedFetchBalance();
    fetch();
  }, [debouncedFetchBalance]);

  return (
    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-lg px-4 py-2 rounded-full border border-purple-900/20 hover:border-purple-500/50 transition-colors">
      {isLoading ? (
        <Loading size="sm" />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={balance}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-2"
          >
            <motion.span
              className="font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              {balance.toLocaleString()}
            </motion.span>
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            >
              {/* Choisissez une des icônes suivantes en décommentant celle que vous préférez */}
              <Coins className="w-6 h-6 text-purple-400" />
              {/* <Gem className="w-6 h-6 text-purple-400" /> */}
              {/* <Sparkles className="w-6 h-6 text-purple-400" /> */}
              {/* <Star className="w-6 h-6 text-purple-400" /> */}
              {/* <Trophy className="w-6 h-6 text-purple-400" /> */}
              {/* <Crown className="w-6 h-6 text-purple-400" /> */}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
