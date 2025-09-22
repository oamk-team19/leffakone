import bcrypt from 'bcrypt';
import { deleteUserDb } from '../models/userModel.js';
import { searchFavoriteList } from '../models/userModel.js';

export const deleteuser = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await deleteUserDb(email);

    if (result.error) {
      return res.status(409).json({ error: result.error });
    }
    res.status(201).json({ message: 'User deletion completed' });
  } catch (error) {
    console.error('User deletion failed in authcontroller', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const searchfavorite = async (req, res) => {
  res.status(200).json({ message: 'TESTII' });
}