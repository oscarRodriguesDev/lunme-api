import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const runtime = "nodejs"; // swagger-jsdoc precisa de Node (fs/glob)

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
        // deixe SEM /api aqui; nos @swagger você usa caminhos começando com /api
        url: process.env.API_BASE_URL,
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
 *     description: "Gera o arquivo de especificação OpenAPI em tempo real usando swagger-jsdoc."
 *     tags:
 *       - Interno - Documentação
 *     responses:
 *       200:
 *         description: "Documento OpenAPI gerado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 */

export async function GET() {
  // Gera na hora para refletir mudanças sem reiniciar o dev server
  const spec = swaggerJSDoc(options);
  return NextResponse.json(spec);
}
