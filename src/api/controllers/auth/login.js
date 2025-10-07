import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";
import bcrypt from "bcryptjs";
// import password
/**
 * POST /login
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  const client = await pool.connect();
  try {
    // basic validation
    if (!username || !password) {
      return formatOutput(res, 400, null, "username and password are required");
    }

    await client.query("BEGIN");

    // fetch user by username
    const result = await client.query(
      "SELECT username, password FROM \"user\" WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      await client.query("COMMIT");
      return formatOutput(res, 401, null, "Invalid username or password");
    }

    const user = result.rows[0];

    // compare raw password with hashed password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      await client.query("COMMIT");
      return formatOutput(res, 401, null, "Invalid username or password");
    }

    // Authentication successful - return minimal user info (no password)
    const payload = { username: user.username };

    await client.query("COMMIT");
    return formatOutput(res, 200, payload);
  } catch (err) {
    await client.query("ROLLBACK");
    return formatOutput(res, 500, false, err.message);
  } finally {
    client.release();
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user using username and password. Returns basic user info when successful.
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
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */