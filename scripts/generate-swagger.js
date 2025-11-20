import globModule from "glob";
import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";

// Compatibilidade glob
const glob = globModule.default || globModule;

console.log("🔍 Lendo rotas do App Router...");

// Busca todas as rotas do Next App Router
const files = glob.sync("./src/app/api/**/*/route.{ts,js}");

console.log("📄 Arquivos encontrados:", files.length);

const autoPaths = {};

// 🔧 Normaliza rotas detectadas automaticamente
function normalizeRoute(filePath) {
  return filePath
    .replace(/^\.\/?/, "") // remove "./"
    .replace("src/app", "") // remove prefixo padrão
    .replace(/\\+/g, "/") // windows
    .replace("/route.ts", "")
    .replace("/route.js", "")
    .replace(/\[([^\]]+)\]/g, "{$1}") // rota dinâmica
    .replace(/\/{2,}/g, "/") // barra duplicada
    .replace(/\/$/, ""); // sem barra no final
}

// 🔍 Varre rotas para descobrir métodos
for (const file of files) {
  const route = normalizeRoute(file);
  const content = fs.readFileSync(file, "utf8");

  const methods = [];
  if (/export\s+async\s+function\s+GET/i.test(content)) methods.push("get");
  if (/export\s+async\s+function\s+POST/i.test(content)) methods.push("post");
  if (/export\s+async\s+function\s+PUT/i.test(content)) methods.push("put");
  if (/export\s+async\s+function\s+PATCH/i.test(content)) methods.push("patch");
  if (/export\s+async\s+function\s+DELETE/i.test(content)) methods.push("delete");

  if (methods.length === 0) continue;

  if (!autoPaths[route]) autoPaths[route] = {};

  for (const m of methods) {
    autoPaths[route][m] = {
      summary: `Auto-generated for ${m.toUpperCase()} ${route}`,
      responses: {
        200: { description: "OK" }
      }
    };
  }
}

console.log("📁 Total de rotas detectadas:", Object.keys(autoPaths).length);

// ---------------------------------------------------------------------------
// 📌 2. Carrega os comentários @swagger do código
// ---------------------------------------------------------------------------

console.log("🔎 Testando arquivos individualmente...");

const apiFiles = glob.sync("./src/app/api/**/*.{ts,js}");

for (const file of apiFiles) {
  const fileContent = fs.readFileSync(file, "utf8");

  if (!fileContent.includes("@swagger")) continue;

  console.log("➡ Testando:", file);

  try {
    swaggerJSDoc({
      definition: {
        openapi: "3.0.0",
        info: { title: "Test", version: "1.0.0" }
      },
      apis: [file]
    });
    console.log("   ✔ OK");
  } catch (err) {
    console.log("   ❌ ERRO NO ARQUIVO!");
    console.error(err);
    process.exit(1);
  }
}

console.log("✔ Nenhum erro individual detectado. Continuando...");




let jsdocSpec;

try {
  jsdocSpec = swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Lunme API",
        version: "1.0.0",
        description: "Swagger gerado automaticamente pelas rotas do Next.js",
      }
    },
    apis: ["./src/app/api/**/*.{ts,js}"],
  });
} catch (err) {
  console.error("❌ Erro ao interpretar anotações @swagger:");
  console.error(err);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 📌 3. Merge das rotas automáticas com as definidas via JSDoc
// ---------------------------------------------------------------------------

const finalPaths = jsdocSpec.paths || {};

for (const route in autoPaths) {
  if (!finalPaths[route]) {
    finalPaths[route] = autoPaths[route];
    continue;
  }

  for (const method in autoPaths[route]) {
    if (!finalPaths[route][method]) {
      finalPaths[route][method] = autoPaths[route][method];
    }
  }
}

// ---------------------------------------------------------------------------
// 📌 4. Monta objeto final Swagger
// ---------------------------------------------------------------------------

const swaggerSpec = {
  openapi: "3.0.0",
  info: jsdocSpec.info,
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:3000"
    }
  ],
  paths: finalPaths,
  components: jsdocSpec.components || {}
};

// ---------------------------------------------------------------------------
// 📌 5. Exporta arquivo
// ---------------------------------------------------------------------------

if (!fs.existsSync("./public")) fs.mkdirSync("./public");

fs.writeFileSync("./public/swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("✅ Swagger gerado com sucesso: public/swagger.json");
