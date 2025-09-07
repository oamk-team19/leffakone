BEGIN;


CREATE TABLE IF NOT EXISTS public."user"
(
    iduser integer NOT NULL,
    email character varying(255)[] NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    PRIMARY KEY (iduser)
);

CREATE TABLE IF NOT EXISTS public."group"
(
    idgroup integer NOT NULL,
    idcreator integer NOT NULL,
    groupname character varying(255) NOT NULL,
    PRIMARY KEY (idgroup)
);

CREATE TABLE IF NOT EXISTS public.movie
(
    "idMovie" integer NOT NULL,
    PRIMARY KEY ("idMovie")
);

CREATE TABLE IF NOT EXISTS public.review
(
    "idReview" integer NOT NULL,
    "idMovie" integer NOT NULL,
    "idUser" integer NOT NULL,
    email character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    rating smallint NOT NULL,
    datetime date NOT NULL,
    PRIMARY KEY ("idReview")
);

CREATE TABLE IF NOT EXISTS public.favorite
(
    "idFavorite" integer NOT NULL,
    "idUser" integer NOT NULL,
    "idMovie" integer NOT NULL,
    PRIMARY KEY ("idFavorite")
);

CREATE TABLE IF NOT EXISTS public.favorite_user
(
    "favorite_idFavorite" integer NOT NULL,
    user_iduser integer NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_group
(
    user_iduser integer NOT NULL,
    group_idgroup integer NOT NULL,
    PRIMARY KEY (user_iduser, group_idgroup)
);

CREATE TABLE IF NOT EXISTS public.group_movie
(
    group_idgroup integer NOT NULL,
    "movie_idMovie" integer NOT NULL,
    PRIMARY KEY (group_idgroup, "movie_idMovie")
);

CREATE TABLE IF NOT EXISTS public.showtime
(
    "idShowtime" integer NOT NULL,
    "idMovie" integer NOT NULL,
    PRIMARY KEY ("idShowtime")
);

ALTER TABLE IF EXISTS public."group"
    ADD FOREIGN KEY (idcreator)
    REFERENCES public."user" (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.review
    ADD CONSTRAINT movie FOREIGN KEY ("idMovie")
    REFERENCES public.movie ("idMovie") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.review
    ADD CONSTRAINT "user" FOREIGN KEY ("idUser")
    REFERENCES public."user" (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.favorite
    ADD FOREIGN KEY ("idUser")
    REFERENCES public."user" (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.favorite
    ADD FOREIGN KEY ("idMovie")
    REFERENCES public.movie ("idMovie") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.favorite_user
    ADD FOREIGN KEY ("favorite_idFavorite")
    REFERENCES public.favorite ("idFavorite") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.favorite_user
    ADD FOREIGN KEY (user_iduser)
    REFERENCES public."user" (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.user_group
    ADD FOREIGN KEY (user_iduser)
    REFERENCES public."user" (iduser) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.user_group
    ADD FOREIGN KEY (group_idgroup)
    REFERENCES public."group" (idgroup) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.group_movie
    ADD FOREIGN KEY (group_idgroup)
    REFERENCES public."group" (idgroup) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.group_movie
    ADD FOREIGN KEY ("movie_idMovie")
    REFERENCES public.movie ("idMovie") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.showtime
    ADD FOREIGN KEY ("idMovie")
    REFERENCES public.movie ("idMovie") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;

END;
