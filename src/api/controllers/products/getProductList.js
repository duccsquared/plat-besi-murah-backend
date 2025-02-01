import { formatOutput } from "../../utils/index.js";


export const getProductList = (req, res) => {
    return formatOutput(res,200,[
        {name:"Plat Baby Coil",id:"platBabyCoil"},{name:"Cutting Size Plate",id:"cuttingSizePlate"},{name:"Base Plate",id:"basePlate"},{name:"Besi Siku Lubang",id:"besiSikuLubang"},{name:"Plat U-head",id:"platUHead"},{name:"Bracket",id:"bracket"}
    ])
};
 /**
 * @swagger
 * /products/list:
 *   get:
 *     summary: obtains a list of products
 *     description: returns a list of products
 *     responses:
 *       200:
 *         description: successfully obtained a list of products
 */ 