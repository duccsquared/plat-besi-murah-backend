import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";

/**
 * GET /article
 * - Returns all articles (list)
 * - Or one article (with body + images) if id provided
 */
export const getArticle = async (req, res) => {
  const articleId = req.query.id;

  try {
    if (!articleId) {
      // Return list of articles only
      const result = await pool.query(
        "SELECT id, title, subtitle, author, publish_date FROM article ORDER BY publish_date DESC, id DESC"
      );
      return formatOutput(res, 200, result.rows);
    } else {
      // Get article main info
      const articleRes = await pool.query(
        "SELECT id, title, subtitle, author, publish_date FROM article WHERE id = $1",
        [articleId]
      );
      if (articleRes.rows.length === 0) {
        return formatOutput(res, 404, null, "Article not found");
      }

      const article = articleRes.rows[0];

      // Get article body (sections)
      const bodyRes = await pool.query(
        "SELECT id, type, body, image_id, position FROM article_body WHERE article_id = $1 ORDER BY position ASC",
        [articleId]
      );

      const sections = [];
      for (let row of bodyRes.rows) {
        if (row.type === "text") {
          sections.push({
            id: row.id,
            type: "text",
            content: row.body,
          });
        } else if (row.type === "image" && row.image_id) {
          const imgRes = await pool.query(
            "SELECT data FROM image WHERE id = $1",
            [row.image_id]
          );
          const imgData = imgRes.rows[0]?.data?.toString("base64")
            .replace('dataimage/jpegbase64','data:image/jpeg;base64,')
            .replace('dataimage/pngbase64','data:image/png;base64,')
            .replace('dataimage/jpgbase64','data:image/jpg;base64,')
             || null;
          sections.push({
            id: row.id,
            type: "image",
            content: imgData,
          });
        }
      }

      article.sections = sections;
      return formatOutput(res, 200, article);
    }
  } catch (err) {
    return formatOutput(res, 500, null, err.message);
  }
};

/**
 * @swagger
 * /article:
 *   get:
 *     summary: Retrieve articles
 *     description: |
 *       - Without query parameters → returns a list of articles (id, title, subtitle, author, publishDate).  
 *       - With `id` query parameter → returns a single article with all its sections (text or image).  
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the article to fetch
 *     responses:
 *       200:
 *         description: Successfully retrieved article(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       subtitle:
 *                         type: string
 *                       author:
 *                         type: string
 *                       publishDate:
 *                         type: string
 *                         format: date
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     subtitle:
 *                       type: string
 *                     author:
 *                       type: string
 *                     publishDate:
 *                       type: string
 *                       format: date
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           type:
 *                             type: string
 *                             enum: [text, image]
 *                           content:
 *                             type: string
 *                             description: |
 *                               For text sections → plain text  
 *                               For image sections → base64 encoded image string
 */
