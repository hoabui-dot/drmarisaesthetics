-- Structural phase 3: identify which frontend surface created each record.
BEGIN;

ALTER TABLE IF EXISTS public.booking_submissions
  ADD COLUMN IF NOT EXISTS submission_source varchar(255) DEFAULT 'booking_modal';

UPDATE public.booking_submissions
SET submission_source = 'booking_modal'
WHERE submission_source IS NULL OR btrim(submission_source) = '';

ALTER TABLE IF EXISTS public.booking_submissions
  ALTER COLUMN submission_type SET DEFAULT 'booking',
  ALTER COLUMN submission_source SET DEFAULT 'booking_modal';

COMMIT;
