import bcrypt from 'bcrypt';
import {
  deleteUserDb,
  addFavoriteDb,
  removeFavoriteDb,
  searchFavoriteListByEmail,
} from '../models/userModel.js';
import { searchFavoriteList } from '../models/userModel.js';

export const deleteuser = async (req, res) => {
  try {
    const { email } = req.body;

    if (email.length === 0) {
      return res.status(409).json({ error: "No email given." });
    }
    const result = await deleteUserDb(email);

    if (result.error) {
      return res.status(409).json({ error: result.error });
    }
    res.status(200).json({ message: 'User deletion completed' });
  } catch (error) {
    console.error('User deletion failed in authcontroller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const searchfavorite = async (req, res) => {
  try {
    const { idUser } = req.query;

    const result = await searchFavoriteList(idUser);
    res.status(200).json(result);
  } catch (error) {
    console.error('Favorite list failed in authcontroller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const result = await addFavoriteDb(req.user, req.body.movieId);
    if (result.error) {
      return res.status(409).json({ error: result.error });
    }
  } catch { }
  res.status(200).send({ msg: 'favorite added' });
};

export const removeFavorite = async (req, res) => {
  try {
    const result = await removeFavoriteDb(req.user, req.body.movieId);
    if (result.error) {
      return res.status(409).json({ error: result.error });
    }
    res.status(200).send({ msg: 'favorite removed' });
  } catch (error) {
    console.error('Removing favorite failed:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const searchFavoriteByEmail = async (req, res) => {
  try {
    const email = req.user;
    const result = await searchFavoriteListByEmail(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Favorite list failed in authcontroller', error.message);
    res.status(500).json({ error: error.message });
  }
};