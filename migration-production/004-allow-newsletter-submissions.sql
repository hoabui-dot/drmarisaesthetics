-- Structural phase 2: newsletter records may contain only an email address.
BEGIN;

ALTER TABLE IF EXISTS public.booking_submissions
  ALTER COLUMN phone_number DROP NOT NULL;

COMMIT;
