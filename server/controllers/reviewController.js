import { insertReview, selectReviewByMovieId } from "../models/reviewModel.js";

export const createReview = async(req, res) => {
    try {
        const { idMovie, idUser, email, description, rating, } = req.body

        const datetime = new Date().toISOString()

        const result = await insertReview({
            idMovie,
            idUser,
            email,
            description,
            rating,
            datetime
        })
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Review creation failed:', error)
        res.status(500).json({erro: 'Failed to save review'})
    }
}

export const getReviews = async(req, res) => {
    const { idMovie } = req.query
    try {
        if (!idMovie) {
            return res.status(400).json({error: 'Missing idMovie'})
        }

        const result = await selectReviewByMovieId(idMovie)
        res.status(200).json(result.rows)
        
    } catch (error) {
        console.error('Error fetching reviews:', error)
        res.status(500).json({error: 'internal server error'})
    }
}
