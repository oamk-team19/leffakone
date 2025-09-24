import { pool } from '../helpers/db.js';

//Get email and password for sign in
export const dataForSignIn = async (email) => {
  try {
    // Get by email
    const result = await pool.query(
      'SELECT iduser,password from users WHERE email=$1',
      [email]
    );

    //console.log('rows:', result);
    //console.log('rows:', result.rows);    //    ---> [ { password: '123' } ]
    //console.log('rows[0]:', result.rows[0]);  //---> { password: '123' }
    //console.log('Password:', result.rows[0].password); //--->123


    if (result.rows.length === 0) {
      return { error: 'Not find user by email from users to login' }
    }
    
    return result.rows[0] //sends { data: '123' }

  } catch (error) {
    console.error('Cound not find user by emai', error.message);
  }
};

// Insert user registration data into db
export const insertRegistration = async (email, username, hashedPassword) => {
  try {
    const emailCheck = await pool.query(
      'SELECT email FROM users WHERE email=$1',
      [email]
    );
    const usernameCheck = await pool.query(
      'SELECT username FROM users WHERE username=$1',
      [username]
    );
    if (emailCheck.rows.length !== 0) {
      return { error: 'Email is already in use' };
    } else if (usernameCheck.rows.length !== 0) {
      return { error: 'Username is already in use' };
    } else {
      const result = await pool.query(
        'INSERT INTO users (email, username, password) VALUES ($1,$2,$3) RETURNING *',
        [email, username, hashedPassword]
      );
      return result.rows[0];
    }
  } catch (error) {
    throw error;
  }
};

// Delete user data from db
export const deleteUserDb = async (email) => {
  try {
    //Uses cascade --> this is enough to delete his reviews and favorites
    const deleteByEmail = await pool.query(
      'DELETE FROM users WHERE email=$1 RETURNING *',
      [email]
    );

    if (deleteByEmail.rows.length === 0) {
      return { error: 'Not find user by email from users' }
    }

    //MITEN SUOSIKKILISTAN URI POISTUU?
    return deleteByEmail.rows[0]; //return deleted data

  } catch (error) {
    throw error;
  }
};

//Search favorite list
export const searchFavoriteList = async (email) => {
  try {
    //Uses cascade --> this is enough to delete his reviews and favorites
    const deleteByEmail = await pool.query(
      'DELETE FROM users WHERE email=$1 RETURNING *',
      [email]
    );

    if (deleteByEmail.rows.length === 0) {
      return { error: 'Not find user by email from users' }
    }

    //MITEN SUOSIKKILISTAN URI POISTUU?
    return deleteByEmail.rows[0]; //return deleted data

  } catch (error) {
    throw error;
  }
};