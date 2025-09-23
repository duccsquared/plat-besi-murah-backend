import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://postgres:qqlqPHaYgzmmJFqIWLPTpDrVQbSpACbm@tramway.proxy.rlwy.net:17479/railway",
  // ssl: {
  //   rejectUnauthorized: false, // Railway’s proxy still requires SSL
  // },
});

export default pool;