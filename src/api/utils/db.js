// db.js
import pkg from "pg";
const { Pool } = pkg;

// Use Railway's DATABASE_PUBLIC_URL in production
// or load from environment variables
const pool = new Pool({
  connectionString: "postgresql://postgres:qqlqPHaYgzmmJFqIWLPTpDrVQbSpACbm@nozomi.proxy.rlwy.net:24122/railway",
  ssl: {
    rejectUnauthorized: false, // Needed for Railway's SSL
  },
});

export default pool;
