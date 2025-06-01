import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types pour notre base de données
export type Card = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  created_at: string;
  updated_at: string;
};

export type UserCollection = {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  acquired_at: string;
};
