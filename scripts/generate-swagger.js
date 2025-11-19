import globModule from "glob";
import fs from "fs";

// Para garantir compatibilidade com QUALQUER versão:
const glob = globModule.default || globModule;

console.log("🔍 Lendo rotas do App Router...");

// Agora funciona em qualquer ambiente
const files = glob.sync("./src/app/api/**/*/route.{ts,js}");

console.log("📄 Arquivos encontrados:", files.length);

const paths = {};

for (const file of files) {
  let route = file
    .replace("src/app", "")
    .replace("/route.ts", "")
    .replace("/route.js", "")
    .replace(/\\/g, "/");

  route = route.replace(/\[([^\]]+)\]/g, "{$1}");

  const content = fs.readFileSync(file, "utf8");

  const methods = [];
  if (/export\s+async\s+function\s+GET/i.test(content)) methods.push("get");
  if (/export\s+async\s+function\s+POST/i.test(content)) methods.push("post");
  if (/export\s+async\s+function\s+PUT/i.test(content)) methods.push("put");
  if (/export\s+async\s+function\s+PATCH/i.test(content)) methods.push("patch");
  if (/export\s+async\s+function\s+DELETE/i.test(content)) methods.push("delete");

  if (methods.length === 0) continue;

  if (!paths[route]) paths[route] = {};

  for (const m of methods) {
    paths[route][m] = {
      summary: `Auto-generated for ${m.toUpperCase()} ${route}`,
      responses: {
        200: { description: "OK" },
      },
    };
  }
}

console.log("📁 Total de rotas Swagger:", Object.keys(paths).length);

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Lunme API",
    version: "1.0.0",
    description: "Swagger gerado automaticamente pelas rotas do Next.js",
  },
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:3000",
    },
  ],
  paths,
};

if (!fs.existsSync("./public")) fs.mkdirSync("./public");

fs.writeFileSync("./public/swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("✅ Swagger gerado com sucesso: public/swagger.json");
