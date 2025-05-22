import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const databaseName = process.env.DB_NAME || "postgres";

const { Pool } = pg;
let pool;

export async function initializeDatabase() {
    try {
        const tempPool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: databaseName,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        await tempPool.query(`CREATE DATABASE "${databaseName}"`).catch(() => {});

        await tempPool.end();

        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: databaseName,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        console.log(`Connected to PostgreSQL database ${databaseName}`);

        await createTables();
        return pool;
    } catch (err) {
        console.error("Database initialization failed:", err);
        throw err;
    }
}

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                surname VARCHAR(100),
                birth_date DATE
            );
        `);
        console.log("Users table ready");

        const res = await pool.query("SELECT COUNT(*) AS count FROM users");
        if (parseInt(res.rows[0].count, 10) === 0) {
            await pool.query(`
                INSERT INTO users (name, surname, birth_date) VALUES 
                ('Jonas', 'Jonaitis', '1995-01-01'),
                ('Petras', 'Petraitis', '1996-02-02'),
                ('Lina', 'Linaite', '1997-03-03');
            `);
            console.log("Added sample users");
        }
    } catch (err) {
        console.error("Table creation failed:", err);
        throw err;
    }
}

export { pool as db };
