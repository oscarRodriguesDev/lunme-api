import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/internal/creditos?userId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Busca o usuário e retorna a coluna creditos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditos: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, creditos: user.creditos }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar créditos do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar créditos" },
      { status: 500 }
    );
  }
}
