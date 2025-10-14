// helpers/db.js
import { migrate } from 'postgres-migrations';

import pkg from 'pg';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const { Pool } = pkg;
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database:
    env === 'test'
      ? process.env.TEST_DB_NAME || 'test_moviemachine'
      : process.env.DB_NAME || 'moviemachine',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
};

const pool = new Pool(dbConfig);

pool.connect((err, client, release) => {
  if (err) {
    console.error(
      `Couldn't connect to the database ${dbConfig.database} on port ${dbConfig.port}. Error:`,
      err.message
    );
  } else {
    console.log(
      `Connected to the database ${dbConfig.database} on port ${dbConfig.port} successfully.`
    );
    release();
  }
});

// Only log errors, not every connection
pool.on('error', (err) => {
  console.error(
    `Database pool error on ${dbConfig.host}:${dbConfig.port}:`,
    err.message
  );
});

const dbMigrate = async () => {
  console.log('Starting database migrations...');

  try {
    await migrate({ client: pool }, './db_migrations/');
    console.log('Database migrations completed successfully.');
  } catch (err) {
    console.error('Database migration error:', err);
    throw err;
  }
};

export { pool, dbMigrate };
