'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS threads (
        _id SERIAL PRIMARY KEY,
        board VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bumped_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reported BOOLEAN DEFAULT FALSE,
        delete_password VARCHAR(255) NOT NULL
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS replies (
        _id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES threads(_id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reported BOOLEAN DEFAULT FALSE,
        delete_password VARCHAR(255) NOT NULL
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_threads_board ON threads(board);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON replies(thread_id);
    `);
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initializeDatabase };
