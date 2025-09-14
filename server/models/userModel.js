import { pool } from '../helpers/db.js';

//Get email and password for sign in
export const dataForSignIn = async (email) => {
  try {
    // Get by email
    const result = await pool.query('SELECT password from users WHERE email=$1;', [email]);

    //console.log('rows:', result.rows);        ---> [ { password: '123' } ]
    //console.log('rows[0]:', result.rows[0]);  ---> { password: '123' }
    //console.log('Password:', result.rows[0].password); --->123

    return {
      data: result.rows[0].password //sends { data: '123' }
    };
  } catch (error) {
    console.error('Cound not find user by emai', error.message);
  }
};
