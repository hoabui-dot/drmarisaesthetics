-- Structural phase 1: prepare the unified operational submissions table.
-- This migration does not copy or delete business records.
BEGIN;

ALTER TABLE IF EXISTS public.booking_submissions
  ADD COLUMN IF NOT EXISTS country varchar(255),
  ADD COLUMN IF NOT EXISTS submission_type varchar(255) DEFAULT 'booking';

ALTER TABLE IF EXISTS public.booking_submissions
  ALTER COLUMN full_name DROP NOT NULL,
  ALTER COLUMN phone_number DROP NOT NULL,
  ALTER COLUMN service DROP NOT NULL;

UPDATE public.booking_submissions
SET submission_type = 'booking'
WHERE submission_type IS NULL OR btrim(submission_type) = '';

COMMIT;
