// models/rootModel.js

import { pool } from '../helpers/db.js';

// Just to check db connection is alive and well
export const checkDbConnection = async () => {
  try {
    // Perform a simple query to test the connection
    const result = await pool.query('SELECT 1 + 1 AS solution;');
    console.log('Database test query result:', result.rows);
    return {
      success: true,
      message: 'Database connected successfully',
      data: result.rows,
    };
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
};
