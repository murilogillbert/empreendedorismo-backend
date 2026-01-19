import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
// Create a pool instance using the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || '',
});
// Logging connection events
pool.on('connect', () => {
    console.log('Database connected successfully');
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
export default {
    query: (text, params) => pool.query(text, params),
    pool,
};
//# sourceMappingURL=dbService.js.map