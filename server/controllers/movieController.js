// controllers/movieController.js
import dotenv from 'dotenv';

dotenv.config();

export const searchMovies = async (req, res) => {
  const { query, page = 1, primary_release_year } = req.query;
  console.log(req.query);
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=${page}&query=${query}&release_year=${primary_release_year}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  fetch(url, options)
    .then((result) => result.json())
    .then((json) => {
      console.log(json);
      res.json(json);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500);
      res.json({ error: 'failed to fetch from external source.' });
    });
};
