import swaggerJsdoc from "swagger-jsdoc";
const url = process.env.NEXT_PUBLIC_URL

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
        url: `${url}/api`, // base da sua API
      },
    ],
  },
  // caminhos para arquivos que contêm comentários Swagger
apis: [
  `${process.cwd()}/app/api/**/*.ts`,
  `${process.cwd()}/app/api/**/*.js`,
],

// caminhos para arquivos que contêm comentários Swagger
  apis: [
    `${process.cwd()}/app/api/**/*.ts`,
    `${process.cwd()}/app/api/**/*.js`,
  ],

};

export const swaggerSpec = swaggerJsdoc(options);
