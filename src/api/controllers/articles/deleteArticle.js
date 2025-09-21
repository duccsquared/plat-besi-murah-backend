import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";

/**
 * DELETE /article
 * - Deletes article + bodies + images
 */
export const deleteArticle = async (req, res) => {
  const { id } = req.query;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get image ids for cleanup
    const imgRes = await client.query(
      "SELECT image_id FROM article_body WHERE article_id=$1 AND image_id IS NOT NULL",
      [id]
    );
    const imageIds = imgRes.rows.map((r) => r.image_id);

    // Delete article body
    await client.query("DELETE FROM article_body WHERE article_id=$1", [id]);

    // Delete images
    if (imageIds.length > 0) {
      await client.query("DELETE FROM image WHERE id = ANY($1)", [imageIds]);
    }

    // Delete article
    await client.query("DELETE FROM article WHERE id=$1", [id]);

    await client.query("COMMIT");
    return formatOutput(res, 200, { id });
  } catch (err) {
    await client.query("ROLLBACK");
    return formatOutput(res, 500, null, err.message);
  } finally {
    client.release();
  }
};

/**
 * @swagger
 * /article:
 *   delete:
 *     summary: Delete an article
 *     description: Deletes an article, along with all associated body sections and images.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the article to delete
 *     responses:
 *       200:
 *         description: Successfully deleted article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */