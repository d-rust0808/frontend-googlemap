const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL_MODE && process.env.DB_SSL_MODE !== 'disable'
    ? { rejectUnauthorized: false }
    : false,
  max: Number(process.env.DB_MAX_OPEN_CONNS) || 10,
  idleTimeoutMillis: Number(process.env.DB_CONN_MAX_LIFETIME) || 3600000,
});

module.exports = pool;


