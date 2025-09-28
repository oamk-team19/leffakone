
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const movieInfo = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'TMDb ID is required' });
  }

  const url = `https://api.themoviedb.org/3/movie/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
      }
    });

    //console.log('TMDB response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('Axios error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch movie info' });
  }
};


