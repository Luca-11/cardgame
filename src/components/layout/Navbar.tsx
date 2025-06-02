"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Diamond } from "lucide-react";

const NAVIGATION_ITEMS = [
  { href: "/collection", label: "Collection" },
  { href: "/boutique", label: "Boutique" },
  { href: "/boosters", label: "Boosters" },
  { href: "/arene", label: "Arène" },
  { href: "/classement", label: "Classement" },
];

export function Navbar() {
  const { user, isLoading, initialize, signOut } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Son de survol simple avec l'API Web Audio
  const playHoverSound = () => {
    try {
      const AudioContext = window.AudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error("Audio non supporté:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-lg border-b border-purple-900/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              >
                CardGame
              </motion.div>
            </Link>

            <div className="hidden md:flex ml-10 space-x-4">
              {NAVIGATION_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-white"
                    onMouseEnter={playHoverSound}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Diamond className="h-5 w-5 text-purple-400" />
                      <span className="text-purple-300 font-medium">
                        {user.user_metadata.diamonds || 0}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full"
                          onMouseEnter={playHoverSound}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.user_metadata.avatar_url || ""}
                            />
                            <AvatarFallback className="bg-purple-500/20">
                              {user.email?.[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profil">
                          <DropdownMenuItem className="cursor-pointer">
                            Profil
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/inventaire">
                          <DropdownMenuItem className="cursor-pointer">
                            Inventaire
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/parametres">
                          <DropdownMenuItem className="cursor-pointer">
                            Paramètres
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500"
                          onClick={() => signOut()}
                        >
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link href="/auth">
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                        onMouseEnter={playHoverSound}
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/auth?mode=signup">
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
                        onMouseEnter={playHoverSound}
                      >
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
