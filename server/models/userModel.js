import { pool } from '../helpers/db.js';

//Get email and password for sign in
export const dataForSignIn = async (email) => {
  try {
    // Get by email
    const result = await pool.query(
      'SELECT iduser,password from users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return { error: 'Not find user by email from users to login' };
    }

    return result.rows[0]; // sends { data: '123' }
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
      return { error: 'Not find user by email from users' };
    }

    //MITEN SUOSIKKILISTAN URI POISTUU?
    return deleteByEmail.rows[0]; //return deleted data
  } catch (error) {
    throw error;
  }
};

//Search a favorite list
export const searchFavoriteList = async (usersId) => {
  try {
    //Uses cascade --> this is enough to delete his reviews and favorites
    const searched = await pool.query(
      'SELECT "idMovie" from favorite where "idUser"=$1',
      [usersId]
    );

    if (searched.rows.length === 0) {
      return { error: 'Not find user by id from users' };
    }

    return searched.rows.map((row) => row.idMovie); //return array of movie IDs
  } catch (error) {
    throw error;
  }
};

// Add a movie to favorite list
export const addFavoriteDb = async (email, idMovie) => {
  console.log('Add to favorite', email, idMovie);
  try {
    const userResult = await pool.query(
      'SELECT iduser FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return { error: 'User not found' };
    }

    const idUser = userResult.rows[0].iduser;

    // Check if the favorite already exists
    const checkFavorite = await pool.query(
      'SELECT * FROM favorite WHERE "idUser" = $1 AND "idMovie" = $2',
      [idUser, idMovie]
    );

    if (checkFavorite.rows.length > 0) {
      return { error: 'Movie is already in favorites' };
    }

    // Add the favorite
    const result = await pool.query(
      'INSERT INTO favorite ("idUser", "idMovie") VALUES ($1, $2) RETURNING *',
      [idUser, idMovie]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Remove a movie from favorite list
export const removeFavoriteDb = async (email, idMovie) => {
  try {
    const userResult = await pool.query(
      'SELECT iduser FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return { error: 'User not found' };
    }

    const idUser = userResult.rows[0].iduser;
    console.log('Removing favorite for user ID:', idUser, 'Movie ID:', idMovie);
    // Remove the favorite
    const result = await pool.query(
      'DELETE FROM favorite WHERE "idUser" = $1 AND "idMovie" = $2 RETURNING *',
      [idUser, idMovie]
    );

    if (result.rows.length === 0) {
      return { error: 'Favorite not found' };
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Search a favorite list by email
export const searchFavoriteListByEmail = async (email) => {
  try {
    // First, get the user ID from email
    const userResult = await pool.query(
      'SELECT iduser FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return { error: 'User not found' };
    }

    const idUser = userResult.rows[0].iduser;

    // Get the favorite list
    const favorites = await pool.query(
      'SELECT "idMovie" FROM favorite WHERE "idUser" = $1',
      [idUser]
    );

    return favorites.rows.map((row) => row.idMovie);
  } catch (error) {
    throw error;
  }
};

// Search  user's approved group requests
export const getSearchApproved = async (usersid) => {
  try {
    const userResult = await pool.query(
      'SELECT user_group.*, groups.groupname FROM "user_group" JOIN groups ON groups.idgroup = user_group.group_idgroup WHERE "user_iduser"=$1 AND "grouprequest"=$2;',
      [usersid, 'approved']
    );

    if (userResult.rows.length === 0) {
      return { message: 'No new approved requests' };
    }
    return userResult.rows;
  } catch (error) {
    throw error;
  }
};


// Search user's rejected group requests
export const getSearchRejected = async (usersid) => {
  try {
    const userResult = await pool.query(
      'SELECT user_group.*, groups.groupname FROM "user_group" JOIN groups ON groups.idgroup = user_group.group_idgroup WHERE "user_iduser"=$1 AND "grouprequest"=$2;',
      [usersid, 'rejected']
    );

    if (userResult.rows.length === 0) {
      return { message: 'No new rejected requests' };
    }
    return userResult.rows;
  } catch (error) {
    throw error;
  }
};
