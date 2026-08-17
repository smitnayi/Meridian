import mysql2 from 'mysql2/promise';

let pool;

function getPool() {
  if (!pool) {
    pool = mysql2.createPool({
      host: process.env.DB_HOST || 'localhost',
      password: process.env.DB_PASSWORD || '',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'meridian',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

const db = {
  query: (...args) => getPool().query(...args),
  execute: (...args) => getPool().execute(...args),
  getConnection: () => getPool().getConnection(),
};

export default db;