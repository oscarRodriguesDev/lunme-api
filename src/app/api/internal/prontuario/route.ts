// app/api/prontuario/[pacienteId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
interface Params {
  params: {
    pacienteId: string;
  };
}

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pacienteId = searchParams.get("pacienteId");

  if (!pacienteId) {
    return NextResponse.json({ error: "ID do paciente não informado" }, { status: 400 });
  }

  try {
    const prontuario = await prisma.prontuario.findUnique({
      where: {
        pacienteId: pacienteId,
      },
    });

    if (!prontuario) {
      return NextResponse.json({ error: "Prontuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(prontuario);
  } catch (error) {
    console.error("Erro ao buscar prontuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}



//post de prontuario
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      pacienteId,
      queixaPrincipal,
      historico,
      conduta,
      transcription,
      evolucao,
    } = body;

    if (!pacienteId) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 });
    }

    // Verifica se já existe um prontuário (caso sua regra seja 1:1)
    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
    });

    if (prontuarioExistente) {
      return NextResponse.json(
        { error: "Paciente já possui prontuário" },
        { status: 409 }
      );
    }

    const novoProntuario = await prisma.prontuario.create({
      data: {
        pacienteId,
        queixaPrincipal,
        historico,
        conduta,
        transcription,
        evolucao,
      },
    });

    return NextResponse.json(novoProntuario, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar prontuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar prontuário", details: error.message },
      { status: 500 }
    );
  }
}



//put de pronturario
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      pacienteId,
      queixaPrincipal,
      historico,
      conduta,
      transcription,
      evolucao,
    } = body;

    if (!pacienteId) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 });
    }

    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
    });

    if (!prontuarioExistente) {
      return NextResponse.json(
        { error: "Prontuário não encontrado para o paciente" },
        { status: 404 }
      );
    }

    const camposAtualizados: any = {
      queixaPrincipal: queixaPrincipal ?? prontuarioExistente.queixaPrincipal,
      historico: historico ?? prontuarioExistente.historico,
      conduta: conduta ?? prontuarioExistente.conduta,
      evolucao: evolucao
        ? (prontuarioExistente.evolucao || '')  + evolucao
        : prontuarioExistente.evolucao,
      transcription: transcription ?? prontuarioExistente.transcription
    };

    const prontuarioAtualizado = await prisma.prontuario.update({
      where: { pacienteId },
      data: camposAtualizados,
    });

    return NextResponse.json(prontuarioAtualizado, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao atualizar prontuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar prontuário", details: error.message },
      { status: 500 }
    );
  }
}
