import pkg from "pg";
import { config } from "dotenv";

config({ path: "../.env" });

const { Pool } = pkg;

async function debugCloudSqlConnection() {
  try {
    console.log("Instance IP:", process.env.GCP_INSTANCE_IP);
    console.log("Database User:", process.env.GCP_USER);
    console.log("Database Name:", process.env.GCP_DATABASE);

    const pool = new Pool({
      host: process.env.GCP_INSTANCE_IP, // Use the public IP here
      port: 5432, // Default port for PostgreSQL
      user: process.env.GCP_USER,
      password: process.env.GCP_PASSWORD,
      database: process.env.GCP_DATABASE,
    });

    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("Connected successfully:", result.rows);

    client.release();
  } catch (err) {
    console.error("Full Error Details:", err);
  }
}

debugCloudSqlConnection();
