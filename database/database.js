const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Users Table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

// Products Table
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id TEXT,
    campaign_name TEXT,
    ad_group_id TEXT,
    fsn_id TEXT,
    product_name TEXT,
    ad_spend REAL,
    views INTEGER,
    clicks INTEGER,
    direct_units INTEGER,
    indirect_units INTEGER,
    direct_revenue REAL,
    indirect_revenue REAL
  );
`);

module.exports = db;
