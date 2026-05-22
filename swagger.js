const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StudySync API",
      version: "1.0.0",
      description: "API para gestionar grupos de estudio"
    },
    servers: [
      {
        url: "https://studysync-api-dul1.onrender.com"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;