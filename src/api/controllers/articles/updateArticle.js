import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";

/**
 * PUT /article
 * - Updates article fields
 * - If sections provided, replaces them entirely
 */
export const updateArticle = async (req, res) => {
  const { id, title, subtitle, author, publishDate, sections } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update article main info
    await client.query(
      "UPDATE article SET title=$1, subtitle=$2, author=$3, publish_date=$4 WHERE id=$5",
      [title, subtitle, author, publishDate, id]
    );

    if (sections) {
      // Delete old bodies + related images
      await client.query("DELETE FROM article_body WHERE article_id=$1", [id]);

      // Insert new sections
      for (let i = 0; i < sections.length; i++) {
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
          [id, section.type, section.type !== "image" ? section.content : null, imageId, i]
        );
      }
    }

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
 *   put:
 *     summary: Update an article
 *     description: |
 *       Updates article metadata and optionally replaces all article body sections.  
 *       If `sections` is included, old sections will be removed and replaced with the new ones.  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the article to update
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
 *     responses:
 *       200:
 *         description: Successfully updated article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */
