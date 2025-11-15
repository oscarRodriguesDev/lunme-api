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
 
/* 
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
}; */


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Token não fornecido" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Opcional: anexar o usuário no request (igual ao NextAuth)
    req.nextUrl.searchParams.set("user", JSON.stringify(decoded));

    return NextResponse.next();
  } catch (err: any) {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/internal/:path*"],
};

