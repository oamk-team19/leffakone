import { pool } from '../helpers/db.js';

//Get email and password for sign in
export const dataForSignIn = async (email) => {
  try {
    // Get by email
    const result = await pool.query('SELECT password from users WHERE email=$1;', [email]);
    //const result = await pool.query('SELECT password from users WHERE $1 = ANY(email);', [email]);
    console.log('rows:', result.rows);
    console.log('salanasa:', result.rows[0].password);
    return {
      data: result.rows
    };
  } catch (error) {
    console.error('Cannot get data for sign in', error.message);
  }
};
