import { formatOutput } from "../../utils/index.js";


export const getProduct = (req, res) => {
    if(req.query.id in productDetails) {
        return formatOutput(res,200,productDetails[req.query.id])
    }
    else {
        return formatOutput(res,400,null,"Invalid Product ID")
    }
};

// hardcoded product details - replace with database later
const productDetails = {
    platBabyCoil: {
        id: "platBabyCoil",
        name: "Plat Baby Coil",
        desc: `
Kami menyediakan plat baby coil dengan harga murah dan dapat membantu untuk menekan biaya produksi. Plat baby coil terdiri dari beberapa spesifikasi sebagai berikut:

Baby Coil SPHC (plat Hitam) & SPHC-PO (plat abu-abu)
tebal: 1.8-6.0mm
Lebar: 900-1220mm
panjang: standard atau sesuai
kebutuhan

Baby Coil SPCC-SD & SPCC-UN (plat putih)
tebal: 0.4-1.8mm
Lebar: 900-1220mm
panjang: standard atau sesuai
kebutuhan
        `
    },
    cuttingSizePlate: {
        id: "cuttingSizePlate",
        name: "Cutting Size Plate",
        desc: ""
    },
    basePlate: {
        id: "basePlate",
        name: "Base Plate",
        desc: "Description for Base Plate"
    },
    besiSikuLubang: {
        id: "besiSikuLubang",
        name: "Besi Siku Lubang",
        desc: "Description for Besi Siku Lubang"
    },
    platUHead: {
        id: "platUHead",
        name: "Plat U-head",
        desc: "Description for Plat U-head"
    },
    bracket: {
        id: "bracket",
        name: "Bracket",
        desc: "Description for Bracket"
    },
}


 /**
 * @swagger
 * /products:
 *   get:
 *     summary: obtains the details of a product based on its ID
 *     description: returns product details
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: successfully obtained product details
 *       400:
 *         description: invalid product ID
 */ 