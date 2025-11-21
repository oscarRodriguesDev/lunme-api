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
        url, // base da sua API
      },
    ],

    // 🔥 Aqui ativamos Bearer Token
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // caminhos onde estão os comentários @swagger
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
