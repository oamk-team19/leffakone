import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const movieTrailer = async (req, res) => {
  const { id } = req.query

    if (!id) {
    return res.status(400).json({ error: 'TMDb ID is required' });
  }

  const url =`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
      }
    });

    const trailers = response.data.results.filter( v =>
      v.type === 'Trailer' &&
      v.site === 'YouTube'
    );

    let trailer =
        trailers.find(v => v.official && /official trailer/i.test(v.name)) ||
        trailers.find(v => /official trailer/i.test(v.name)) ||
        trailers[0];
    
    if (!trailer) {
      return res.status(404).json({error: 'No trailer found'});
    }
    res.json({
      name: trailer.name,
      key: trailer.key,
      site: trailer.site,
      url: `https://www.youtube.com/watch?v=${trailer.key}`
    })
    console.log('TMDB response:', trailer)
    
  } catch (err) {
    console.error('Axios error:',err.response?.data || err.message);
    res.status(500).json({error: 'Failed to fetch trailer'});
  }
};