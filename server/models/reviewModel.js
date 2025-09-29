import { pool } from "../helpers/db.js";

const insertReview = async({ idMovie, idUser, email, description, rating, datetime}) => {
    return await pool.query('insert into review ("idMovie", "idUser", email, description, rating, datetime) values ($1, $2, $3, $4, $5, $6) returning *',
        [idMovie, idUser, email, description, rating, datetime]
    )
}

const selectReviewByMovieId = async (idMovie) => {
    return await pool.query('select * from review where "idMovie" = $1 order by "idReview" desc', [idMovie])
}

export { insertReview, selectReviewByMovieId }