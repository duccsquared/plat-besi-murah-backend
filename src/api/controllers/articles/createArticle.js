import pool from "../../utils/db.js";
import { formatOutput } from "../../utils/index.js";
import sharp from "sharp";
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
        // Await the compression so we pass a Buffer (not a Promise) to the DB
        // const compressed = await compressImageBase64(section.content, true);
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


const bufferToDataURI = (buffer, mime = "image/webp") => {
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

/**
 * Compress base64 image input and return either a Buffer (default) or a data URI string.
 * @param {string|Buffer} base64String - data URI, raw base64 string, or Buffer
 * @param {boolean} [asDataUri=false] - when true, returns a data URI string (data:...;base64,...)
 * @returns {Promise<Buffer|string>}
 */
const compressImageBase64 = async (base64String, asDataUri = false) => {
  // Handle different possible inputs: Buffer, data URI string, plain base64 string
  if (!base64String) {
    throw new Error("No image data provided");
  }

  let buffer;
  if (Buffer.isBuffer(base64String)) {
    buffer = base64String;
  } else if (typeof base64String === "string") {
    // Remove data URI prefix if present: data:image/png;base64,....
    const match = base64String.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
    const rawBase64 = match ? match[2] : base64String.replace(/\s/g, "");

    try {
      buffer = Buffer.from(rawBase64, "base64");
    } catch (e) {
      throw new Error("Invalid base64 image data");
    }
  } else {
    throw new Error("Unsupported image input type");
  }

  try {
    const compressedBuffer = await sharp(buffer)
      .toFormat("webp", { quality: 70 })
      .toBuffer();

    if (asDataUri) {
      // Return a webp data URI so frontend gets the prefix it expects
      return bufferToDataURI(compressedBuffer, "image/webp");
    }
    return compressedBuffer;
  } catch (err) {
    throw new Error("Failed to process image: " + err.message);
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