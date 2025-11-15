import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//avaliação de psicologos e da reunião pro final da reunião
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audio,
      video,
      experienciaGeral,
      avaliacaoProfissional,
      comentario,
      psicologoId,
    } = body;

    // Validação básica
    if (
      typeof audio !== "number" ||
      typeof video !== "number" ||
      typeof experienciaGeral !== "number" ||
      typeof avaliacaoProfissional !== "number" ||
      typeof psicologoId !== "string"
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios inválidos." },
        { status: 400 }
      );
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        audio,
        video,
        experienciaGeral,
        avaliacaoProfissional,
        comentario,
        psicologoId,
      },
    });

    return NextResponse.json(novaAvaliacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar avaliação." },
      { status: 500 }
    );
  }
}
