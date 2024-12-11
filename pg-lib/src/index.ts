import pkg from "pg";
const { Client } = pkg;
import env from "dotenv";
env.config();

async function insertToDb(username: string, email: string, password: string) {
  const client = new Client({
    connectionString: process.env.DBSTRING,
  });

  try {
    await client.connect();
    console.log("Connected to the database.");

    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        );
      `);

    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);";
    const values = [username, email, password];

    const res = await client.query(insertQuery, values);
    console.log(`Insert Successful: ${res.rowCount} row(s) inserted.`);
    return res.rows[0];
  } catch (error) {
    console.error(`Error during insert: ${error}`);
  } finally {
    await client.end();
    console.log("Database connection closed after insertion.");
  }
}

async function searchInDb(email: string) {
  const client = new Client({
    connectionString: process.env.DBSTRING,
  });

  try {
    await client.connect();
    console.log("Connected to the database for search.");

    const query = `SELECT * FROM users WHERE email = $1`;
    const value = [email];

    const res = await client.query(query, value);

    if (res.rows.length > 0) {
      console.log(`User found: ${res.rows[0]}`);
      return res.rows[0];
    } else {
      console.log(`No user found with given email.`);
      return null;
    }
  } catch (error) {
    console.log(`Error during query: ${error}`);
  } finally {
    await client.end();
    console.log("Database connection closed after search.");
  }
}

(async () => {
  try {
    await insertToDb("username2", "user2@example.com", "user2password");
    await searchInDb("user2@example.com");
  } catch (error) {
    console.error("Error in example usage:", error);
  }
})();
