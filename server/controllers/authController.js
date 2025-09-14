import { dataForSignIn } from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body; //email and password inside of curly brackets means that it searches them from req.body
    
    if(!email || !password){
      console.log('Missing email and/or password')
      return res.status(400).json({ message: 'Check email and password'})
    }

    const result = await dataForSignIn(email); //send email to db to get a password linked to email
    //console.log(result.data); //result.data = 123

    const match = await bcrypt.compare(password, result.data)
    if (match) {
      //if (password === result.data) {
      //if passwords match --> create a token
      const token = jwt.sign({ user: email }, JWT_SECRET, { expiresIn: '2m' }) //expires in 2 minutes
      return res.status(200).json({ email: email, token: token })
    } else {
      //no matching passwords
      return res.status(401).json({ error: 'Invalid credentials' })
    }

  } catch (error) {
    console.error('Not matching passwords', error);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {

};