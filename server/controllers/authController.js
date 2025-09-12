import { dataForSignIn } from '../models/userModel.js';

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body; //get email  etsii email ja password nimen tullee frontti
    const result = await dataForSignIn(email); //send email to db
    res.status(200).json(result);
    console.log(result);
  } catch (error) {
    console.error('Find user by email', error);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {

};