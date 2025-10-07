import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";
import bcrypt from "bcryptjs";

/**
 * POST /register
 */
export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return formatOutput(res, 400, null, "username and password are required");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // check existing user
    const existing = await client.query(
      "SELECT username FROM \"user\" WHERE username = $1",
      [username]
    );
    if (existing.rows.length > 0) {
      await client.query("COMMIT");
      return formatOutput(res, 409, null, "Username already exists");
    }

    // hash password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // insert user
    await client.query(
      "INSERT INTO \"user\" (username, password) VALUES ($1, $2)",
      [username, hashed]
    );

    await client.query("COMMIT");
    return formatOutput(res, 201, { username });
  } catch (err) {
    await client.query("ROLLBACK");
    return formatOutput(res, 500, null, err.message);
  } finally {
    client.release();
  }
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username and password. Password will be stored hashed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing parameters
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
