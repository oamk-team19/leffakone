BEGIN;

ALTER TABLE IF EXISTS public.group_movie DROP CONSTRAINT IF EXISTS "group_movie_movie_idMovie_fkey";

ALTER TABLE IF EXISTS public.favorite DROP CONSTRAINT IF EXISTS "favorite_idMovie_fkey";

ALTER TABLE IF EXISTS public.review DROP CONSTRAINT IF EXISTS movie;

ALTER TABLE IF EXISTS public.showtime DROP CONSTRAINT IF EXISTS "showtime_idMovie_fkey";

DROP TABLE IF EXISTS public.movie;

ALTER TABLE IF EXISTS public.favorite_user DROP CONSTRAINT IF EXISTS "favorite_user_favorite_idFavorite_fkey";

ALTER TABLE IF EXISTS public.favorite_user DROP CONSTRAINT IF EXISTS favorite_user_user_iduser_fkey;

DROP TABLE IF EXISTS public.favorite_user;

ALTER TABLE IF EXISTS public.favorite
    ADD CONSTRAINT "user" FOREIGN KEY ("idUser")
    REFERENCES public.users (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;

DROP TABLE IF EXISTS public.showtime;

CREATE TABLE IF NOT EXISTS public.showtime
(
    "idEvent" integer NOT NULL,
    "idShow" integer NOT NULL,
	"idGroup" integer NOT NULL,
    CONSTRAINT showtime_pkey PRIMARY KEY ("idEvent")
);

ALTER TABLE IF EXISTS public.showtime
    ADD CONSTRAINT showtime_group_idgroup_fkey FOREIGN KEY ("idGroup")
    REFERENCES public.groups (idgroup) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;

COMMIT;