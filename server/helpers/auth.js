import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const jwt_secret = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
  let decodedUser = null;
  if (!req.headers.authorization && !req.cookies['refreshToken']) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const authHeader = req.headers.authorization;
    const access_token = authHeader.split(' ')[1];
    decodedUser = jwt.verify(access_token, jwt_secret);
  } catch (error) {
    try {
      const refresh_token = req.cookies['refreshToken'];
      decodedUser = jwt.verify(refresh_token, jwt_secret);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } finally {
    res.exposeHeaders();
    res.authorizationHeader(decodedUser.user);
    req.user = decodedUser.user;
    next();
  }
};
