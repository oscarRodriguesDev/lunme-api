import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // 1. Buscar CSRF Token
    const csrfRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();

    // 2. Executar login no NextAuth
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          callbackUrl: "/",
          json: "true"
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const res = NextResponse.json(data);
    const cookie = response.headers.get("set-cookie");
    if (cookie) res.headers.set("set-cookie", cookie);

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
