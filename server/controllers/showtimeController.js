import { findShowtimeByShowAndGroup, insertShowtime, selectShowtimeByGroupId } from "../models/showtimeModel.js";

export const createShowtime = async(req, res) => {
    try {
        const { idEvent, idShow, idGroup, day } = req.body

        const existing = await findShowtimeByShowAndGroup(idShow, idGroup)
        if(existing.rows.length > 0) {
            return res.status(409).json({error: 'Show already added to this group'})
        }

        const result = await insertShowtime({
            idEvent,
            idShow,
            idGroup,
            day
        })
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Adding showtime failed:', error)
        res.status(500).json({error: 'Failed to save showtime'})
    }
}

export const getShowtimes = async(req, res) => {
    const { idGroup } = req.query
    try {
        if(!idGroup) {
            return res.status(400).json({error: 'Missing idGroup'})
        }

        const result = await selectShowtimeByGroupId(idGroup)
        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error fetching showtimes', error)
        res.status(500).json({error: 'internal server error'})
    }
}