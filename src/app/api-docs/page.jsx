"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";


export default function ApiDocsPage() {
  return (
    <>
    
    <div style={{ height: "100vh" }}>
      <SwaggerUI
        url="/api/swagger"              // nosso endpoint JSON
        docExpansion="list"             // opcional: "none" para fechado
        defaultModelsExpandDepth={0}    // esconde schemas por padrão
      />
    </div>
    </>
  );
}
