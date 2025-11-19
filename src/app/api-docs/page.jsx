"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI
        url="/swagger.json"
        docExpansion="list"
        defaultModelsExpandDepth={0}
      />
    </div>
  );
}
