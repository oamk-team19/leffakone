import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbMigrate, pool } from './helpers/db.js';
import rootRouter from './routers/rootRouter.js';
import moviesRouter from './routers/movieRouter.js';
import authRouter from './routers/authRouter.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

dotenv.config();

const env = process.env.NODE_ENV;
const port = process.env.PORT || 3001;
const jwt_secret = process.env.JWT_SECRET;
await dbMigrate();
const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const { sign } = jwt;
  res.exposeHeaders = () => {
    return res.header(
      'Access-Control-Expose-Headers',
      'Authorization,Set-Cookie'
    );
  };

  res.authorizationHeader = (email) => {
    const access_token = jwt.sign({ user: email }, jwt_secret, {
      expiresIn: '1m',
    });
    return res.header('Authorization', 'Bearer ' + access_token);
  };

  res.refreshToken = (email) => {
    const refresh_token = jwt.sign({ user: email }, jwt_secret, {
      expiresIn: '2m',
    });

    return res.cookie('refreshToken', refresh_token, {
      maxAge: 1000 * 60 * 2,
    });
  };

  next();
});

app.post('/autologin', (req, res) => {
  if (req.cookies['refreshToken']) {
    try {
      const refresh_token = req.cookies['refreshToken'];
      const decodedUser = verify(refresh_token, jwt_secret);
      return res
        .exposeHeaders()
        .authorizationHeader(decodedUser.email)
        .status(200)
        .json({ message: 'Valid refreshtoken' });
    } catch (error) {
      return res.status(401).json({ email: decodedUser.email });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

app.use('/', rootRouter);
app.use('/movies', moviesRouter);
app.use('/auth', authRouter); //for signin and signup

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
