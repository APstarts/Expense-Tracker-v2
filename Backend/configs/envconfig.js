import dotenv from 'dotenv';

dotenv.config();

const {PORT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN} = process.env;

export {PORT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN};