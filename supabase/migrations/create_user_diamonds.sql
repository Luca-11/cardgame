-- Table pour stocker le solde de diamants des utilisateurs
CREATE TABLE IF NOT EXISTS user_diamonds (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 1000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sécurité RLS
ALTER TABLE user_diamonds ENABLE ROW LEVEL SECURITY;

-- Policies pour user_diamonds
CREATE POLICY "Users can view their own diamond balance"
    ON user_diamonds FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own diamond balance"
    ON user_diamonds FOR UPDATE
    USING (auth.uid() = user_id);

-- Fonction pour créer le solde initial d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_diamonds (user_id, balance)
    VALUES (new.id, 1000)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un solde pour les nouveaux utilisateurs
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 