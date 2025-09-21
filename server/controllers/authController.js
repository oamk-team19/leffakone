import { dataForSignIn } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { insertRegistration } from '../models/userModel.js';
import { deleteUserDb } from '../models/userModel.js';

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body; //email and password inside of curly brackets means that it searches them from req.body

    if (!email || !password) {
      console.log('Missing email and/or password');
      return res.status(400).json({ message: 'Check email and password' });
    }

    const result = await dataForSignIn(email); //send email to db to get a password linked to email
    //console.log(result.data); //result.data = 123

    const match = await bcrypt.compare(password, result.data);
    if (match) {
      //if passwords match --> create a token
      return res
        .exposeHeaders()
        .authorizationHeader(email)
        .refreshToken(email)
        .status(200)
        .json({ email: email });
    } else {
      //no matching passwords
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Not matching passwords', error);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await insertRegistration(email, username, hashedPassword);

    if (newUser.error) {
      return res.status(409).json({ error: newUser.error });
    }
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const signout = async (req, res) => {
  res.clearCookie('refreshToken', { path: '/' });
  res.status(200).json({ message: 'Logged out' });
}

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
