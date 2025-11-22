import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  console.log("REQ HEADERS:", Object.fromEntries(req.headers));

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Token não fornecido" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  console.log("Token recebido no middleware:", token);
  console.log("SECRET:", process.env.JWT_SECRET);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);

    // anexar payload no request
    req.nextUrl.searchParams.set("user", JSON.stringify(payload));

    return NextResponse.next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/internal/:path*"],
};
