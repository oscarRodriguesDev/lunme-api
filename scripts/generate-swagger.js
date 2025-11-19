import { glob } from "glob";
import fs from "fs";

console.log("Gerando Swagger...");

// Garante que o Next.js está apontando pro SRCDIR correto
const files = await glob("./src/app/api/**/*.{ts,js}");

console.log("Arquivos encontrados:", files);

// EXEMPLO — você ainda vai injetar os paths reais aqui
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Lunme API",
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:3000",
    }
  ],
  paths: {}, // depois vamos preencher isso automaticamente
};

fs.writeFileSync("./public/swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger gerado em public/swagger.json");
