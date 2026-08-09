import mysql2 from 'mysql2/promise';

const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

console.log(`Database Connected On ${process.env.DB_HOST}`);

export default db;