import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbMigrate, pool } from './helpers/db.js';
import rootRouter from './routers/rootRouter.js';
import moviesRouter from './routers/movieRouter.js';
import authRouter from './routers/authRouter.js';
import movieinfoRouter from './routers/movieinfoRouter.js';
import trailerRouter from './routers/trailerRouter.js';

dotenv.config();

const env = process.env.NODE_ENV;
const port = process.env.PORT || 3001;
const dbpool = pool;
await dbMigrate();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', rootRouter);

app.use('/movies', moviesRouter);
app.use('/auth', authRouter); //for signin and signup
app.use('/movie', movieinfoRouter);
app.use('/video',trailerRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: status,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
