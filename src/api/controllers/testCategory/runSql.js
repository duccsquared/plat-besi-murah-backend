import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";


export const runSql = async (req, res) => {
  const sql = req.query.sql;
  if (!sql) {
    return formatOutput(res, 400, null, "SQL query is required");
  }

  try {
    const result = await pool.query(sql);
    return formatOutput(res, 200, result.rows);
  } catch (err) {
    console.log(err)
    return formatOutput(res, 500, null, err.message);
  }
};

/**
 * @swagger
 * /testCategory/runSql:
 *   post:
 *     summary: run a custom SQL command
 *     description: executes a raw SQL command on the database and returns the result
 *     parameters:
 *       - in: query
 *         name: sql
 *         schema:
 *           type: string
 *         required: true
 *         description: the SQL command to execute
 *     responses:
 *       200:
 *         description: successfully executed SQL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 */