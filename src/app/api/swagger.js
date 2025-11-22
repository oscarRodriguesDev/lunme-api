import swaggerJsdoc from "swagger-jsdoc";

const url = process.env.NEXT_PUBLIC_URL + "/api";

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
    components: {
      // 🔥 Define o esquema de autenticação Bearer (JWT)
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
