"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";


export default function ApiDocsPage() {
  const rota = process.env.API_BASE_URL || "http://localhost:3000";
  return (
    <>
    
    <div style={{ height: "100vh" }}>
      <SwaggerUI
        url={`${rota}/api/swagger`}              // nosso endpoint JSON
        docExpansion="list"             // opcional: "none" para fechado
        defaultModelsExpandDepth={0}    // esconde schemas por padrão
      />
    </div>
    </>
  );
}
