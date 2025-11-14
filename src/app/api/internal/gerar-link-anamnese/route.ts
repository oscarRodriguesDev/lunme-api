import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log("Recebido POST em /api/internal/gerar-link-anamnese");
  try {
    const {  psicologoId } = await req.json();

    if ( !psicologoId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: psicologoId" },
        { status: 400 }
      );
    }

    const token = randomUUID(); // pode usar nanoid() se preferir

    await prisma.acessoAnamneseTemp.create({
      data: {
        token,
        psicologoId, 
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/amnp/${psicologoId}/${token}`;

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
