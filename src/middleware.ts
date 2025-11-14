// middleware.ts
/* import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Página de login
  },
  callbacks: {
    authorized: ({ token }) => {
      // Só permite se o usuário estiver autenticado
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/app/:path*",        // protege toda a área logada
    "/api/internal/:path*", // protege apenas APIs internas
  ],
}; */
 

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Só permite se o usuário estiver autenticado (token presente)
    authorized: ({ token }) => !!token,
  },
});

// Protege apenas as rotas internas da API
export const config = {
  matcher: [
    "/api/internal/:path*",
  ],
};
