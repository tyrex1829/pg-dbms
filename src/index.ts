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
    console.log(`Insert Successful ${res}`);
  } catch (error) {
    console.error(`Error during insert: ${error}`);
  } finally {
    await client.end();
  }
}

insertToDb("username2", "user2@example.com", "user2password");
