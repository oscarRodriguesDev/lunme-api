import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); //chave secreta para key da clinica de psicologia no futuro

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não existe no sistema." },
        { status: 404 }
      );
    }

    // 2. Validar senha (bcrypt)
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Usuário ou senha incorretos." },
        { status: 401 }
      );
    }

    // 3. Verificar roles permitidos (igual ao NextAuth)
    const allowedRoles = [
      UserRole.ADMIN,
      UserRole.PSYCHOLOGIST,
      UserRole.COMMON,
      UserRole.PISICOLOGO_ADM,
    ];

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Acesso negado: este usuário não tem permissão." },
        { status: 403 }
      );
    }

    // 4. Criar JWT com seus dados do token()
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        crp: user.crp ?? null,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        crp: user.crp,
      },
      token,
      expiresIn: "3h",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
