import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Plat Besi Murah Backend",
      version: "1.0.0",
      description: "Backend API for Plat Besi Murah",
    },
    servers: [{ url: "http://localhost:8080/api" }],
  },
  apis: ["src/api/controllers/*/*.js", "src/api/controllers/*/*/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
