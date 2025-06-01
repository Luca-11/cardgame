-- Suppression des anciennes tables si elles existent
DROP TABLE IF EXISTS daily_quests;
DROP TABLE IF EXISTS daily_logins;
DROP FUNCTION IF EXISTS generate_daily_quests;

-- Table pour stocker les connexions quotidiennes
CREATE TABLE IF NOT EXISTS daily_logins (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_login_date DATE NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 1,
    longest_streak INTEGER NOT NULL DEFAULT 1,
    last_reward_claimed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id)
);

-- Table pour stocker les quêtes journalières
CREATE TABLE IF NOT EXISTS daily_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_type TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    target INTEGER NOT NULL,
    reward_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_quest_type CHECK (quest_type IN ('open_boosters', 'open_packs', 'collect_cards'))
);

-- Sécurité RLS
ALTER TABLE daily_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

-- Policies pour daily_logins
CREATE POLICY "Users can view their own login streak"
    ON daily_logins FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own login streak"
    ON daily_logins FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own login streak"
    ON daily_logins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies pour daily_quests
CREATE POLICY "Users can view their own quests"
    ON daily_quests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
    ON daily_quests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
    ON daily_quests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Fonction pour générer les quêtes quotidiennes
CREATE OR REPLACE FUNCTION generate_daily_quests(p_user_id UUID)
RETURNS void AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
BEGIN
    -- Vérifier si l'utilisateur a déjà des quêtes pour aujourd'hui
    IF NOT EXISTS (
        SELECT 1 FROM daily_quests
        WHERE user_id = p_user_id
        AND DATE(created_at) = current_date
    ) THEN
        -- Créer une quête pour ouvrir des boosters
        INSERT INTO daily_quests (
            user_id, quest_type, target, reward_amount
        ) VALUES (
            p_user_id, 'open_boosters', 3, 100
        );

        -- Créer une quête pour ouvrir des packs
        INSERT INTO daily_quests (
            user_id, quest_type, target, reward_amount
        ) VALUES (
            p_user_id, 'open_packs', 1, 300
        );

        -- Créer une quête pour collecter des cartes
        INSERT INTO daily_quests (
            user_id, quest_type, target, reward_amount
        ) VALUES (
            p_user_id, 'collect_cards', 15, 200
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 