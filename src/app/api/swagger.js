import swaggerJsdoc from "swagger-jsdoc";
const url = process.env.NEXT_PUBLIC_URL+"/api";

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
        url: url, // base da sua API
      },
    ],
  },
  // caminhos para arquivos que contêm comentários Swagger
  apis: ["./app/api/**/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);
