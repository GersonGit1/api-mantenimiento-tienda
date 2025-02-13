import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({path: ".env"});

const pool = mysql.createPool({
    host: process.env.BD_HOST || "localhost",
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;