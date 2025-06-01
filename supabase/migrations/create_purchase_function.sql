-- Fonction pour gérer l'achat d'un pack de manière atomique
CREATE OR REPLACE FUNCTION purchase_pack(p_transaction_id UUID, p_amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_balance INTEGER;
BEGIN
    -- Récupérer l'utilisateur de la transaction
    SELECT user_id INTO v_user_id
    FROM transactions
    WHERE id = p_transaction_id;

    -- Vérifier que l'utilisateur est bien l'utilisateur authentifié
    IF v_user_id != auth.uid() THEN
        RETURN FALSE;
    END IF;

    -- Récupérer le solde actuel
    SELECT balance INTO v_current_balance
    FROM user_diamonds
    WHERE user_id = v_user_id
    FOR UPDATE;  -- Verrouiller la ligne pour éviter les conditions de concurrence

    -- Vérifier si le solde est suffisant
    IF v_current_balance < p_amount THEN
        -- Marquer la transaction comme échouée
        UPDATE transactions
        SET status = 'failed',
            completed_at = now()
        WHERE id = p_transaction_id;
        
        RETURN FALSE;
    END IF;

    -- Mettre à jour le solde
    UPDATE user_diamonds
    SET balance = balance - p_amount,
        updated_at = now()
    WHERE user_id = v_user_id;

    -- Marquer la transaction comme terminée
    UPDATE transactions
    SET status = 'completed',
        completed_at = now(),
        balance_before = v_current_balance,
        balance_after = v_current_balance - p_amount
    WHERE id = p_transaction_id;

    RETURN TRUE;
END;
$$; 