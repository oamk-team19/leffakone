BEGIN;

ALTER TABLE public.showtime
DROP CONSTRAINT showtime_pkey;

ALTER TABLE public.showtime
ADD CONSTRAINT showtime_pkey PRIMARY KEY ("idShow", "idGroup");

COMMIT;