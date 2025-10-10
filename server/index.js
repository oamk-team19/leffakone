import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbMigrate, pool } from './helpers/db.js';
import rootRouter from './routers/rootRouter.js';
import moviesRouter from './routers/movieRouter.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import movieinfoRouter from './routers/movieinfoRouter.js';
import trailerRouter from './routers/trailerRouter.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import reviewRouter from './routers/reviewRouter.js';
import groupRouter from './routers/groupRouter.js';

dotenv.config();

const env = process.env.NODE_ENV;
const port = process.env.PORT || 3001;
const jwt_secret = process.env.JWT_SECRET;

if (env === 'develoment') {
  await dbMigrate();
}

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's actual origin
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers from the client
};
const app = express();
app.use(cors(corsOptions));
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
      expiresIn: '15m',
    });
    return res.header('Authorization', 'Bearer ' + access_token);
  };

  res.refreshToken = (email) => {
    const refresh_token = jwt.sign({ user: email }, jwt_secret, {
      expiresIn: '30m',
    });

    return res.cookie('refreshToken', refresh_token, {
      maxAge: 1000 * 60 * 30,
    });
  };

  next();
});

app.post('/autologin', (req, res) => {
  if (req.cookies['refreshToken']) {
    try {
      const refresh_token = req.cookies['refreshToken'];
      const decodedUser = jwt.verify(refresh_token, jwt_secret);
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
app.use('/group', groupRouter); //for group actions
app.use('/user', userRouter);
app.use('/movie', movieinfoRouter);
app.use('/video', trailerRouter);
app.use('/review', reviewRouter);
app.use('/video', trailerRouter);

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
