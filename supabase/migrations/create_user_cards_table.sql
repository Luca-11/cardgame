-- Create the user_cards table
CREATE TABLE IF NOT EXISTS user_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_name TEXT NOT NULL,
    card_description TEXT,
    card_image TEXT,
    card_rarity TEXT NOT NULL,
    card_attack INTEGER NOT NULL,
    card_defense INTEGER NOT NULL,
    card_mana INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cards" 
    ON user_cards FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" 
    ON user_cards FOR INSERT 
    WITH CHECK (auth.uid() = user_id); 