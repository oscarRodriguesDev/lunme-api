import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const runtime = "nodejs"; // swagger-jsdoc precisa de Node (fs/glob)

// Define os globs para capturar todos os arquivos com comentários @swagger
const apisGlobs = [
  path.join(process.cwd(), "src", "app", "api", "**/*.{js,ts,jsx,tsx}"),
  path.join(process.cwd(), "app", "api", "**/*.{js,ts,jsx,tsx}"),
];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lunme",
      version: "1.0.0",
      description: "Documentação da API (OpenAPI 3) gerada com swagger-jsdoc",
    },
    servers: [
      {
        // Base da sua API
        url: process.env.NEXT_PUBLIC_URL,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Aplica BearerAuth globalmente (apenas para rotas que precisam de token)
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: apisGlobs,
};

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Retorna o documento OpenAPI/Swagger da API
 *     description: Gera o arquivo de especificação OpenAPI em tempo real usando swagger-jsdoc
 *     tags:
 *       - Interno - Documentação
 *     responses:
 *       200:
 *         description: Documento OpenAPI gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 */

export async function GET() {
  try {
    const spec = swaggerJSDoc(options);
    return NextResponse.json(spec);
  } catch (err) {
    console.error("Erro ao gerar Swagger spec:", err);
    return NextResponse.json(
      { error: "Erro ao gerar Swagger spec", details: err.message },
      { status: 500 }
    );
  }
}
