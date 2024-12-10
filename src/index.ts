import { Client } from "pg";

async function insertToDb() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "new user",
    password: "mysecretpassword",
  });

  try {
    await client.connect();
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ('username1', 'user2@example.com', 'user_password');";
    const res = await client.query(insertQuery);
    console.log(`Insert Successful ${res}`);
  } catch (error) {
    console.error(`Error during insert: ${error}`);
  } finally {
    await client.end();
  }
}

insertToDb();
