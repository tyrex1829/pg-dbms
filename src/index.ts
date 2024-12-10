import { Client } from "pg";
import env from "dotenv";
env.config();

const client = new Client({
  connectionString: process.env.DBSTRING,
});

async function insertToDb(username: string, email: string, password: string) {
  try {
    await client.connect();
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);";
    const values = [username, email, password];
    const res = await client.query(insertQuery, values);
    console.log(`Insert Successful: ${res}`);
  } catch (error) {
    console.error(`Error during insert: ${error}`);
  } finally {
    await client.end();
  }
}

async function searchInDb(email: string) {
  try {
    await client.connect();
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
  }
}

insertToDb("username2", "user2@example.com", "user2password");
searchInDb("user2@example.com");
