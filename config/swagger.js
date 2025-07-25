// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hack2Skill API",
      version: "1.0.0",
      description: "API for managing user contacts",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000", // fallback to local
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Scan for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
