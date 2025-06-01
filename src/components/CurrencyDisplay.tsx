"use client";

import { useDiamondsStore } from "@/store/diamonds";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "./ui/loading";

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
    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
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
              className="font-bold text-white"
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
            <motion.span
              className="text-lg"
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            >
              💎
            </motion.span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
