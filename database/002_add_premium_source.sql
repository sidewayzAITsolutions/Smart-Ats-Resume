-- Migration: Add premium_source column to profiles and backfill existing premium users
-- PostgreSQL-compatible ADD COLUMN with constraint & default
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name='profiles' AND column_name='premium_source'
	) THEN
		ALTER TABLE profiles ADD COLUMN premium_source TEXT DEFAULT 'stripe';
		ALTER TABLE profiles ADD CONSTRAINT profiles_premium_source_check CHECK (premium_source IN ('stripe','admin','promo'));
	END IF;
END $$;

-- Backfill: set premium_source='stripe' where is_premium=true and subscription_status in typical Stripe statuses
UPDATE profiles SET premium_source='stripe'
WHERE premium_source IS NULL AND is_premium=true;
