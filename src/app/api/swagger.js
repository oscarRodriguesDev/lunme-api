import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Api Lunme",
      version: "1.0.0",
      description: "Documentação da API gerada pelo Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // base da sua API
      },
    ],
  },
  // caminhos para arquivos que contêm comentários Swagger
  apis: ["./app/api/**/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);
