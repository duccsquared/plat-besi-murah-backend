import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";

/**
 * POST /article
 * - Creates new article + body + images
 */
export const createArticle = async (req, res) => {
  const { title, subtitle, author, publishDate, sections } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert article
    const articleRes = await client.query(
      "INSERT INTO article (title, subtitle, author, publish_date) VALUES ($1,$2,$3,$4) RETURNING id",
      [title, subtitle, author, publishDate]
    );
    const articleId = articleRes.rows[0].id;

    // Insert body sections
    for (let i = 0; i < (sections?.length || 0); i++) {
      const section = sections[i];
      let imageId = null;

      if (section.type === "image" && section.content) {
        const imgRes = await client.query(
          "INSERT INTO image (name, data) VALUES ($1,$2) RETURNING id",
          [`image_${Date.now()}`, Buffer.from(section.content, "base64")]
        );
        imageId = imgRes.rows[0].id;
      }

      await client.query(
        "INSERT INTO article_body (article_id, type, body, image_id, position) VALUES ($1,$2,$3,$4,$5)",
        [articleId, section.type, section.type !== "image" ? section.content : null, imageId, i]
      );
    }

    await client.query("COMMIT");
    return formatOutput(res, 201, { id: articleId });
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
 *   post:
 *     summary: Create a new article
 *     description: Creates a new article with its sections (text or images).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               author:
 *                 type: string
 *               publishDate:
 *                 type: string
 *                 format: date
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [text, image]
 *                     content:
 *                       type: string
 *                       description: |
 *                         Text content or base64 encoded image string
 *     responses:
 *       201:
 *         description: Successfully created article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */