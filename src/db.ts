import { Client } from 'pg';
import 'dotenv/config';


const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect().then(() => {
    console.log('Connected to the database successfully');
}).catch(err => {
    console.error('Database connection error:', err);
});

// Export the client for use in other modules
export default client;