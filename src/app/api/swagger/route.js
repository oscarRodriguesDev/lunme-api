import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const runtime = "nodejs"; // necessário para swagger-jsdoc

// Garante que encontraremos os arquivos tanto em DEV quanto na VERCEL
const apisGlobs = [
  path.join(process.cwd(), "app", "api", "**/*.{js,ts}"),
  path.join(process.cwd(), "src", "app", "api", "**/*.{js,ts}"),
  path.join(process.cwd(), "**/app/api/**/*.{js,ts}"),
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
        // Deixe somente "/"
        // O Swagger UI se adapta ao domínio automaticamente
        url: "/",
      },
    ],
  },
  apis: apisGlobs,
};

export async function GET() {
  const spec = swaggerJSDoc(options);
  return NextResponse.json(spec);
}
