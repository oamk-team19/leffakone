import { pool } from '../helpers/db.js';

const insertShowtime = async({idEvent, idShow, idGroup, day}) => {
    return await pool.query('insert into showtime("idEvent", "idShow", "idGroup", day) values ($1, $2, $3, $4) returning *',
        [idEvent, idShow, idGroup, day]
    )
}

const selectShowtimeByGroupId = async(idGroup) => {
    return await pool.query('select * from showtime where "idGroup" = $1', [idGroup])
}

const findShowtimeByShowAndGroup = async(idShow, idGroup) => {
    return await pool.query('select * from showtime where "idShow" = $1 and "idGroup" = $2',
        [idShow,idGroup]
    )
}

export { insertShowtime, selectShowtimeByGroupId, findShowtimeByShowAndGroup}