"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config");
const client = new pg_1.Client({
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
exports.default = client;
