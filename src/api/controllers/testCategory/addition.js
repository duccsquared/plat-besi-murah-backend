export const addition = (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ error: "Invalid numbers" });
    }
  
    const sum = num1 + num2;
    res.json({ sum });
  };
 /**
 * @swagger
 * /testCategory/addition:
 *   post:
 *     summary: add two numbers
 *     description: returns the sum of two numbers passed as query parameters
 *     parameters:
 *       - in: query
 *         name: num1
 *         schema:
 *           type: number
 *         required: true
 *         description: first number
 *       - in: query
 *         name: num2
 *         schema:
 *           type: number
 *         required: true
 *         description: second number
 *     responses:
 *       200:
 *         description: successfully added the numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 */ 