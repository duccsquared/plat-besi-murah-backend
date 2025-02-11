import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/swagger.js";
import routes from "./src/api/routes/index.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", routes);

// swagger API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
